// Teaching Cards JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Handle Opal links
    const opalLinks = document.querySelectorAll('.opal-link');
    
    opalLinks.forEach(link => {
        const content = link.getAttribute('data-content');
        if (content) {
            // Extract Opal link from content
            const regex = /<a[^>]+href="([^"]+)"[^>]*>.*?<\/a>/;
            const match = content.match(regex);
            
            if (match && match[1]) {
                link.href = match[1];
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            } else {
                // Hide the link if no valid URL found
                link.style.display = 'none';
            }
        }
    });
});
