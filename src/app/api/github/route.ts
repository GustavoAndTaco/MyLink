import { NextResponse } from "next/server";

const GITHUB_OWNER = "GustavoAndTaco";
const GITHUB_REPO = "MyLink";

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "MyLink-App",
    };

    const [userRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_OWNER}`, {
        headers,
        next: { revalidate: 300 },
      }),
      fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=1`, {
        headers,
        next: { revalidate: 300 },
      }),
    ]);

    let reposCount = 0;
    if (userRes.ok) {
      const userData = await userRes.json();
      reposCount = typeof userData.public_repos === "number" ? userData.public_repos : 0;
    }

    let commitsCount = 0;
    if (commitsRes.ok) {
      const linkHeader = commitsRes.headers.get("link");
      if (linkHeader) {
        const lastMatch = linkHeader.match(/[?&]page=(\d+)>;\s*rel="last"/);
        if (lastMatch && lastMatch[1]) {
          commitsCount = Number(lastMatch[1]);
        }
      }
      if (commitsCount === 0) {
        const commitsData = await commitsRes.json();
        commitsCount = Array.isArray(commitsData) ? commitsData.length : 0;
      }
    }

    return NextResponse.json({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      commitsCount,
      reposCount,
    });
  } catch (error) {
    console.error("GitHub API 조회 실패:", error);
    return NextResponse.json(
      { owner: GITHUB_OWNER, repo: GITHUB_REPO, commitsCount: 0, reposCount: 0 },
      { status: 200 }
    );
  }
}
