export async function saveToGitHub(data: any, token: string, owner: string, repo: string, path: string = 'public/data.json') {
  try {
    // 1. Get the current file info to get its SHA
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const getRes = await fetch(url + `?ref=main`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!getRes.ok && getRes.status !== 404) {
      throw new Error(`Failed to read file from GitHub. Status: ${getRes.status}`);
    }

    let sha = '';
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    // 2. Encode payload data to base64 via UTF-8 safe method
    const jsonStr = JSON.stringify(data, null, 2);
    // encodeURIComponent gives utf8 handling to btoa
    const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

    // 3. Update the file
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Auto-update data from Admin Panel',
        content: base64Content,
        sha: sha || undefined,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const errTxt = await putRes.text();
      throw new Error(`Failed to commit file to GitHub. Output: ${errTxt}`);
    }

    return await putRes.json();
  } catch (error) {
    console.error('GitHub API Save Error:', error);
    throw error;
  }
}
