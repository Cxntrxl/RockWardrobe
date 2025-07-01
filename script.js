setTimeout(() => {
    const baseUrl = 'https://rockwardrobe.pages.dev';
    const data = window.location.search;

    const targetUrl = baseUrl + data;
    window.location.href = targetUrl;
}, 5000);