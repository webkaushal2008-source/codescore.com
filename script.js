document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const htmlTextarea = document.getElementById('html-code');
    const cssTextarea = document.getElementById('css-code');
    const jsTextarea = document.getElementById('js-code');
    const calculateBtn = document.getElementById('calculate-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navList = document.getElementById('nav-list');
    const themeToggle = document.getElementById('theme-toggle');
   
    // Code info elements
    const htmlLinesElement = document.getElementById('html-lines');
    const htmlCharsElement = document.getElementById('html-chars');
    const complexityElement = document.getElementById('complexity');
   
    // Result elements
    const htmlCostElement = document.getElementById('html-cost');
    const cssCostElement = document.getElementById('css-cost');
    const jsCostElement = document.getElementById('js-cost');
    const totalPriceElement = document.getElementById('total-price');
    const htmlLinesCountElement = document.getElementById('html-lines-count');
    const cssLinesCountElement = document.getElementById('css-lines-count');
    const jsLinesCountElement = document.getElementById('js-lines-count');
    const estimatedTimeElement = document.getElementById('estimated-time');
    const complexityLevelElement = document.getElementById('complexity-level');
   
    // Pricing rates (cents per line)
    const htmlRate = 0.25; 
    const cssRate = 0.50;  
    const jsRate = 0.75;   
   
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
   
    // Tab functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
           
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
           
            // Show active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
           
            // Update code info for active tab
            updateCodeInfo(tabId);
        });
    });
   
    // Update code info when text changes
    [htmlTextarea, cssTextarea, jsTextarea].forEach(textarea => {
        textarea.addEventListener('input', function() {
            const tabId = getActiveTab();
            updateCodeInfo(tabId);
        });
    });
   
    // Calculate price when button is clicked
    calculateBtn.addEventListener('click', function() {
        // Show loading state
        this.classList.add('calculating');
        this.disabled = true;
        
        // Simulate processing time (3 seconds)
        setTimeout(() => {
            calculatePrice();
            // Hide loading state
            this.classList.remove('calculating');
            this.disabled = false;
        }, 3000);
    });
    
    // Refresh all fields when refresh button is clicked
    refreshBtn.addEventListener('click', refreshAll);
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Theme toggle
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navList.classList.contains('active') && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('.mobile-menu-toggle')) {
            navList.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
   
    // Get active tab
    function getActiveTab() {
        return document.querySelector('.tab-btn.active').getAttribute('data-tab');
    }
   
    // Update code information
    function updateCodeInfo(tabId) {
        let textarea;
        switch(tabId) {
            case 'html':
                textarea = htmlTextarea;
                break;
            case 'css':
                textarea = cssTextarea;
                break;
            case 'js':
                textarea = jsTextarea;
                break;
        }
       
        if (textarea) {
            const code = textarea.value;
            const lines = code.split('\n').filter(line => line.trim() !== '').length;
            const chars = code.length;
            const complexity = calculateComplexity(code, tabId);
           
            htmlLinesElement.textContent = lines;
            htmlCharsElement.textContent = chars;
            complexityElement.textContent = complexity;
            complexityElement.className = `complexity-${complexity.toLowerCase()}`;
        }
    }
    
    // Calculate code complexity
    function calculateComplexity(code, type) {
        const lines = code.split('\n').filter(line => line.trim() !== '').length;
        
        if (type === 'html') {
            const elementCount = (code.match(/<[^>]+>/g) || []).length;
            const complexityScore = elementCount / Math.max(1, lines);
            
            if (complexityScore > 1.5) return 'High';
            if (complexityScore > 0.8) return 'Medium';
            return 'Low';
        }
        
        if (type === 'css') {
            const selectorCount = (code.match(/[^{}]*\{/g) || []).length;
            const complexityScore = selectorCount / Math.max(1, lines);
            
            if (complexityScore > 0.7) return 'High';
            if (complexityScore > 0.4) return 'Medium';
            return 'Low';
        }
        
        if (type === 'js') {
            const functionCount = (code.match(/(function|=>)\s*[{(]/g) || []).length;
            const complexityScore = functionCount / Math.max(1, lines);
            
            if (complexityScore > 0.3) return 'High';
            if (complexityScore > 0.15) return 'Medium';
            return 'Low';
        }
        
        return 'Low';
    }
    
    // Refresh all fields
    function refreshAll() {
        // Clear all textareas
        htmlTextarea.value = '';
        cssTextarea.value = '';
        jsTextarea.value = '';
        
        // Reset code info
        htmlLinesElement.textContent = '0';
        htmlCharsElement.textContent = '0';
        complexityElement.textContent = 'Low';
        complexityElement.className = '';
        
        // Reset prices
        htmlCostElement.textContent = '$0.00';
        cssCostElement.textContent = '$0.00';
        jsCostElement.textContent = '$0.00';
        totalPriceElement.textContent = '$0.00';
        htmlLinesCountElement.textContent = '0';
        cssLinesCountElement.textContent = '0';
        jsLinesCountElement.textContent = '0';
        estimatedTimeElement.textContent = '0-2 hours';
        complexityLevelElement.textContent = 'Low';
        
        // Show toast notification
        showToast('All fields have been refreshed!');
    }
    
    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide and remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
   
    // Function to calculate the price
    function calculatePrice() {
        // Get code from textareas
        const htmlCode = htmlTextarea.value;
        const cssCode = cssTextarea.value;
        const jsCode = jsTextarea.value;
       
        // Count lines of code (excluding empty lines)
        const htmlLines = htmlCode.split('\n').filter(line => line.trim() !== '').length;
        const cssLines = cssCode.split('\n').filter(line => line.trim() !== '').length;
        const jsLines = jsCode.split('\n').filter(line => line.trim() !== '').length;
       
        // Calculate costs
        const htmlCost = htmlLines * htmlRate;
        const cssCost = cssLines * cssRate;
        const jsCost = jsLines * jsRate;
       
        // Calculate total
        const total = htmlCost + cssCost + jsCost;
        
        // Calculate complexity level
        const htmlComplexity = calculateComplexity(htmlCode, 'html');
        const cssComplexity = calculateComplexity(cssCode, 'css');
        const jsComplexity = calculateComplexity(jsCode, 'js');
        
        // Determine overall complexity
        let overallComplexity = 'Low';
        if (htmlComplexity === 'High' || cssComplexity === 'High' || jsComplexity === 'High') {
            overallComplexity = 'High';
        } else if (htmlComplexity === 'Medium' || cssComplexity === 'Medium' || jsComplexity === 'Medium') {
            overallComplexity = 'Medium';
        }
        
        // Estimate time based on complexity and lines of code
        const totalLines = htmlLines + cssLines + jsLines;
        let estimatedTime = '';
        
        if (overallComplexity === 'High') {
            estimatedTime = `${Math.ceil(totalLines / 20)}-${Math.ceil(totalLines / 10)} hours`;
        } else if (overallComplexity === 'Medium') {
            estimatedTime = `${Math.ceil(totalLines / 30)}-${Math.ceil(totalLines / 15)} hours`;
        } else {
            estimatedTime = `${Math.ceil(totalLines / 50)}-${Math.ceil(totalLines / 25)} hours`;
        }
       
        // Update UI with results
        htmlCostElement.textContent = `$${htmlCost.toFixed(2)}`;
        cssCostElement.textContent = `$${cssCost.toFixed(2)}`;
        jsCostElement.textContent = `$${jsCost.toFixed(2)}`;
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
        htmlLinesCountElement.textContent = htmlLines;
        cssLinesCountElement.textContent = cssLines;
        jsLinesCountElement.textContent = jsLines;
        estimatedTimeElement.textContent = estimatedTime;
        complexityLevelElement.textContent = overallComplexity;
       
        // Add animation to price display
        totalPriceElement.classList.add('price-updated');
        setTimeout(() => {
            totalPriceElement.classList.remove('price-updated');
        }, 1000);
        
        // Show success toast
        showToast('Price calculation completed successfully!');
    }
   
    // Initialize with sample code
    htmlTextarea.value = `<!DOCTYPE html>
<html>
<head>
    <title>Sample Website</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Website</div>
            <ul class="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </header>
   
    <main>
        <section class="hero">
            <h1>Welcome to Our Website</h1>
            <p>We create amazing web experiences</p>
            <button class="cta-button">Get Started</button>
        </section>
       
        <section class="features">
            <div class="feature">
                <h3>Responsive Design</h3>
                <p>Looks great on any device</p>
            </div>
            <div class="feature">
                <h3>Modern UI</h3>
                <p>Clean and intuitive interface</p>
            </div>
            <div class="feature">
                <h3>Fast Performance</h3>
                <p>Optimized for speed</p>
            </div>
        </section>
    </main>
   
    <footer>
        <p>&copy; 2023 Website. All rights reserved.</p>
    </footer>
   
    <script src="script.js"></script>
</body>
</html>`;
   
    cssTextarea.value = `/* Global Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

/* Header Styles */
header {
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

/* Hero Section */
.hero {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}

.cta-button {
    padding: 1rem 2rem;
    background: #2575fc;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Features Section */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.feature {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s;
}

.feature:hover {
    transform: translateY(-5px);
}

.feature h3 {
    margin-bottom: 1rem;
    color: #2575fc;
}

/* Footer */
footer {
    text-align: center;
    padding: 2rem;
    background: #333;
    color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
   
    .hero h1 {
        font-size: 2rem;
    }
   
    .features {
        grid-template-columns: 1fr;
    }
}`;
   
    jsTextarea.value = `// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    console.log('Website initialized');
   
    // Initialize smooth scrolling for navigation links
    initSmoothScrolling();
   
    // Initialize button interactions
    initButtonInteractions();
   
    // Initialize animations
    initAnimations();
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');
   
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
           
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Button interactions
function initButtonInteractions() {
    const ctaButton = document.querySelector('.cta-button');
   
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Animation effect
            this.style.transform = 'scale(0.95)';
           
            setTimeout(() => {
                this.style.transform = '';
                showNotification('Thank you for your interest! We will contact you soon.');
            }, 200);
        });
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
   
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top: '20px';
    notification.style.right: '20px';
    notification.style.background: '#28a745';
    notification.style.color: 'white';
    notification.style.padding: '1rem 1.5rem';
    notification.style.borderRadius: '5px';
    notification.style.zIndex: '1000';
    notification.style.boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.transform: 'translateX(100%)';
    notification.style.transition: 'transform 0.3s ease';
   
    // Add to document
    document.body.appendChild(notification);
   
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
   
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize animations
function initAnimations() {
    // Animate features on scroll
    const features = document.querySelectorAll('.feature');
   
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
   
    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        feature.style.transition: 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(feature);
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize with debounce
window.addEventListener('resize', debounce(function() {
    console.log('Window resized');
}, 250));`;
   
    // Update stats for sample code
    updateCodeInfo('html');
    document.addEventListener
    ("contextmenu", function(e)
    {
        e.preventDefault()
    },false)
});