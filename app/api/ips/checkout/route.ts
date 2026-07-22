import { NextResponse } from "next/server";
import {
  DEFAULT_IPS_PAYEE,
  buildIpsPayload,
  calculateIpsTotals,
  normalizeIpsReference,
  normalizeSerbianAccount,
  sanitizeIpsText,
  type IpsCheckoutItem,
  type NbsEurRate,
} from "@/lib/ips-payment";

export const runtime = "nodejs";

const NBS_RATE_SOURCE_URL =
  "https://webappcenter.nbs.rs/ExchangeRateWebApp/ExchangeRate/CurrentMiddleRate";
const NBS_QR_GENERATE_URL = "https://nbs.rs/QRcode/api/qr/v1/generate/360?lang=sr_RS_Latn";

type RequestBody = {
  items?: IpsCheckoutItem[];
  reference?: string;
};

type NbsQrResponse = {
  s?: {
    code?: number;
    desc?: string;
  };
  i?: string;
  t?: string;
  e?: string[];
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function parseNbsDate(value: string) {
  const match = value.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!match) return value;

  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function extractText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchNbsEurRate(): Promise<NbsEurRate> {
  const response = await fetch(NBS_RATE_SOURCE_URL, {
    cache: "no-store",
    headers: {
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`NBS kursna lista nije dostupna (${response.status}).`);
  }

  const html = await response.text();
  const text = extractText(html);
  const eurMatch = text.match(/\bEUR\s+978\s+.+?\s+1\s+(\d{2,3},\d{4})\b/);
  const dateMatch = text.match(
    /(FORMIRANA NA DAN|ФОРМИРАНА НА ДАН)\s+(\d{1,2}\.\d{1,2}\.\d{4})/i
  );
  const listMatch = text.match(/KURSNA LISTA BR\.\s*(\d+)|КУРСНА ЛИСТА БР\.\s*(\d+)/i);

  if (!eurMatch) {
    throw new Error("Nije moguce procitati EUR srednji kurs sa NBS kursne liste.");
  }

  const rate = Number(eurMatch[1].replace(",", "."));
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("NBS EUR srednji kurs nije ispravan.");
  }

  return {
    currency: "EUR",
    rate,
    rateDate: dateMatch ? parseNbsDate(dateMatch[2]) : new Date().toISOString().slice(0, 10),
    listNumber: listMatch?.[1] ?? listMatch?.[2],
    sourceUrl: NBS_RATE_SOURCE_URL,
  };
}

async function generateNbsQrImage(payload: string) {
  const response = await fetch(NBS_QR_GENERATE_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: payload,
  });

  const raw = await response.text();
  let data: NbsQrResponse;

  try {
    data = JSON.parse(raw) as NbsQrResponse;
  } catch {
    throw new Error("NBS generator nije vratio JSON odgovor.");
  }

  if (!response.ok || data.s?.code !== 0 || !data.i) {
    const details = data.e?.join(" ") || data.s?.desc || "Validacija IPS QR koda nije prosla.";
    throw new Error(details);
  }

  return {
    image: `data:image/png;base64,${data.i}`,
    validationCode: data.s.code,
    validationMessage: data.s.desc ?? "OK",
    normalizedPayload: data.t ?? payload,
  };
}

function validateItems(items: unknown): IpsCheckoutItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Korpa je prazna.");
  }

  return items.map((item) => {
    const value = item as Partial<IpsCheckoutItem>;
    if (
      typeof value.id !== "string" ||
      typeof value.type !== "string" ||
      typeof value.title !== "string" ||
      typeof value.price !== "number" ||
      typeof value.currency !== "string" ||
      typeof value.quantity !== "number"
    ) {
      throw new Error("Korpa sadrzi stavku u neispravnom formatu.");
    }

    return {
      id: value.id,
      type: value.type as IpsCheckoutItem["type"],
      title: value.title,
      price: value.price,
      currency: value.currency,
      quantity: value.quantity,
      meta: value.meta,
    };
  });
}

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return jsonError("Zahtev za IPS placanje nije ispravan.");
  }

  try {
    const items = validateItems(body.items);
    const reference = normalizeIpsReference(body.reference ?? `${Date.now()}`);
    const needsEurRate = items.some((item) => item.currency.trim().toUpperCase() === "EUR");
    const eurRate = needsEurRate ? await fetchNbsEurRate() : undefined;
    const totals = calculateIpsTotals(items, eurRate?.rate);
    if (totals.amountRsdCents <= 0) {
      throw new Error("Iznos za IPS placanje mora biti veci od nule.");
    }
    const payeeAccount =
      process.env.NBS_IPS_PAYEE_ACCOUNT ||
      process.env.NEXT_PUBLIC_NBS_IPS_PAYEE_ACCOUNT ||
      DEFAULT_IPS_PAYEE.account;
    const payeeName =
      process.env.NBS_IPS_PAYEE_NAME ||
      process.env.NEXT_PUBLIC_NBS_IPS_PAYEE_NAME ||
      DEFAULT_IPS_PAYEE.name;
    const paymentCode =
      process.env.NBS_IPS_PAYMENT_CODE ||
      process.env.NEXT_PUBLIC_NBS_IPS_PAYMENT_CODE ||
      DEFAULT_IPS_PAYEE.paymentCode;
    const purpose = sanitizeIpsText(`Porudzbina ABLux ${reference.slice(-8)}`, 35);
    const payload = buildIpsPayload({
      account: payeeAccount,
      payeeName,
      amountRsdCents: totals.amountRsdCents,
      reference,
      paymentCode,
      purpose,
    });
    const qr = await generateNbsQrImage(payload);

    return NextResponse.json(
      {
        reference,
        qrImage: qr.image,
        payload: qr.normalizedPayload,
        validation: {
          code: qr.validationCode,
          message: qr.validationMessage,
        },
        amountRsd: totals.amountRsd,
        amountRsdCents: totals.amountRsdCents,
        originalTotals: totals.originalTotals,
        lines: totals.lines,
        exchangeRate: eurRate ?? null,
        payee: {
          account: normalizeSerbianAccount(payeeAccount),
          displayAccount: payeeAccount,
          name: sanitizeIpsText(payeeName, 70),
        },
        paymentCode,
        purpose,
        generatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "IPS placanje nije moguce generisati.";
    const upstream = /NBS|Validacija|generator|kurs/i.test(message);
    return jsonError(message, upstream ? 502 : 400);
  }
}
