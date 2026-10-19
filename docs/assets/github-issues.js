(() => {
  const repository = "https://github.com/foelkdavid/debian-docs";
  const endpoint = "https://api.github.com/repos/foelkdavid/debian-docs/issues?state=open&sort=updated&direction=desc&per_page=30";
  let cachedIssues;
  let cachedAt = 0;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function issueCard(issue) {
    const card = element("article", "issue-card");
    const heading = element("h3");
    const link = element("a", "", issue.title);
    link.href = `${repository}/issues/${issue.number}`;
    heading.append(link);
    card.append(element("span", "issue-state", `Open · #${issue.number}`), heading);

    if (issue.body) {
      // Treat GitHub content as text, never as HTML.
      card.append(element("p", "issue-excerpt", issue.body.slice(0, 240)));
    }

    if (issue.labels.length) {
      const labels = element("div", "issue-labels");
      for (const label of issue.labels) {
        labels.append(element("span", "issue-label", label.name));
      }
      card.append(labels);
    }

    const date = new Date(issue.created_at);
    const meta = element("p", "issue-meta", `Opened by ${issue.user?.login || "a contributor"} · `);
    const time = element("time", "", date.toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    }));
    time.dateTime = issue.created_at;
    meta.append(time, ` · ${issue.comments} ${issue.comments === 1 ? "comment" : "comments"}`);
    card.append(meta);
    return card;
  }

  async function loadIssues() {
    const container = document.querySelector("[data-github-issues]");
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = "true";
    const status = container.querySelector(".issues-status");
    const grid = container.querySelector(".issues-grid");
    status.hidden = false;
    container.setAttribute("aria-busy", "true");

    try {
      if (!cachedIssues || Date.now() - cachedAt > 60000) {
        const response = await fetch(endpoint, {
          headers: { Accept: "application/vnd.github+json" },
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected GitHub response");
        // GitHub's issues endpoint also includes pull requests.
        cachedIssues = data.filter(issue => !issue.pull_request).slice(0, 6);
        cachedAt = Date.now();
      }
      grid.replaceChildren(...cachedIssues.map(issueCard));
      grid.hidden = cachedIssues.length === 0;
      status.textContent = "No open issues right now. Have a suggestion? Create an issue below.";
      status.hidden = cachedIssues.length > 0;
    } catch {
      status.textContent = "Couldn't load issues right now. You can still view them on GitHub below.";
    } finally {
      container.setAttribute("aria-busy", "false");
    }
  }

  // MkDocs Material replaces page content during instant navigation.
  if (typeof document$ !== "undefined") {
    document$.subscribe(loadIssues);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadIssues);
  } else {
    loadIssues();
  }
})();
