
export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = url.searchParams.get("page") ?? "1";

    const resp = await fetch(`https://api-v2.deepsearch.com/v2/companies/stocks?market=kr&page=${page}&page_size=16&api_key=${process.env.DEEPSEARCH_API_KEY}`, {
        next: { revalidate: 3600 }
    });

    const data = await resp.json();
    return Response.json(data);
}