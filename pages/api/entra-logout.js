// pages/api/entra-logout.js
export default function handler(req, res) {
    // URL components
    const tenantId = '2b30530b-69b6-4457-b818-481cb53d42ae'; // Replace with your tenant ID
    const postLogoutRedirectUri = encodeURIComponent('https://scholarseats.com/'); // Replace with your redirect URI

    // Entra ID logout URL
    const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;

    // Redirect the user to Entra ID logout
    res.redirect(logoutUrl);
}
