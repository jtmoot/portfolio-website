const CACHE_KEY = "gh_repos";
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchRepos() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    const res = await fetch(
      "https://api.github.com/users/joshuamoorehead/repos?sort=pushed&per_page=10&type=owner"
    );
    if (!res.ok) return [];

    const raw = await res.json();
    const data = raw.map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      html_url: r.html_url,
      updated_at: r.updated_at,
      topics: r.topics || [],
      fork: r.fork,
    }));

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch {
    return [];
  }
}
