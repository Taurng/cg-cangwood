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

export async function uploadImageToGitHub(fileBytes: Uint8Array, filename: string, token: string, owner: string, repo: string) {
  try {
    const timestamp = Date.now();
    const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `public/uploads/img_${timestamp}_${safeFilename}`;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    // Convert Uint8Array to Base64
    let binary = '';
    const bytes = new Uint8Array(fileBytes);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64Content = btoa(binary);

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload image: ${safeFilename}`,
        content: base64Content,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const errTxt = await putRes.text();
      throw new Error(`Failed to upload image. Output: ${errTxt}`);
    }

    // Return the jsdelivr CDN URL or raw github URL to bypass caching/waiting for GH Pages build
    return `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  } catch (error) {
    console.error('GitHub API Image Upload Error:', error);
    throw error;
  }
}
