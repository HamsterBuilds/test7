class PortfolioApp {
    constructor() {
        this.projects = [];
        this.products = [];
        this.settings = {};
        this.currentImageIndex = 0;
        this.currentImages = [];
        this.currentScreen = 'landing';
        this.selectedStyle = null;
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadProjects();
        await this.loadProducts();
        this.setupScreenNavigation();
        this.setupEventListeners();
    }

    setupScreenNavigation() {
        const btnStraightToHiring = document.getElementById('btn-straight-to-hiring');
        const btnStore = document.getElementById('btn-store');
        const btnCheckPastWork = document.getElementById('btn-check-past-work');
        const styleButtons = document.querySelectorAll('.choose-style-btn');
        const contactMeBtn = document.getElementById('contact-me-btn');
        const backFromStyles = document.getElementById('back-from-styles');
        const backFromStore = document.getElementById('back-from-store');

        if (btnStraightToHiring) {
            btnStraightToHiring.addEventListener('click', () => {
                this.switchScreen('style-selection');
            });
        }

        if (btnStore) {
            btnStore.addEventListener('click', () => {
                this.switchScreen('store');
                this.renderStoreProducts();
            });
        }

        if (btnCheckPastWork) {
            btnCheckPastWork.addEventListener('click', () => {
                this.switchScreen('portfolio');
                this.renderReviews();
                this.renderProjects();
                this.updateProjectCount();
                this.setupNavigation();
            });
        }

        if (backFromStyles) {
            backFromStyles.addEventListener('click', () => {
                this.switchScreen('landing');
            });
        }

        if (backFromStore) {
            backFromStore.addEventListener('click', () => {
                this.switchScreen('landing');
            });
        }

        styleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const style = btn.getAttribute('data-style');
                this.selectedStyle = style;
                this.showProjectsByStyle(style);
                this.switchScreen('projects-by-style');
            });
        });

        if (contactMeBtn) {
            contactMeBtn.addEventListener('click', () => {
                const discordModal = document.getElementById('discord-modal');
                if (discordModal) {
                    discordModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    }

    switchScreen(screenName) {
        window.scrollTo(0, 0);
        
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    showProjectsByStyle(style) {
        const projectsList = document.getElementById('projects-list');
        const styleTitle = document.getElementById('style-title');
        
        if (!projectsList) return;

        let filteredProjects = this.projects;
        if (style !== 'all') {
            filteredProjects = this.projects.filter(p => p.style === style);
        }

        const styleName = style.charAt(0).toUpperCase() + style.slice(1);
        styleTitle.textContent = `${styleName} ${style === 'all' ? 'Projects' : 'Style Examples'}`;

        projectsList.innerHTML = '';

        if (filteredProjects.length === 0) {
            projectsList.innerHTML = '<p class="no-projects-message">No projects available for this style yet. Contact me for a custom build!</p>';
            return;
        }

        filteredProjects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-item';
            
            setTimeout(() => projectCard.classList.add('visible'), index * 100);

            projectCard.innerHTML = `
                <div class="project-item-image">
                    <img src="${project.thumbnail}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x300/f8fafb/666666?text=Image+Not+Found'">
                </div>
                <div class="project-item-info">
                    <h3 class="project-item-title">${project.title}</h3>
                    <p class="project-item-description">${project.description}</p>
                    <p class="project-item-price">${project.price || 'Contact for price'}</p>
                </div>
            `;

            projectsList.appendChild(projectCard);
        });
    }

    async loadSettings() {
        try {
            const response = await fetch('./settings.json');
            if (!response.ok) throw new Error('Failed to load settings');
            this.settings = await response.json();
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = { badges: [] };
        }
    }

    renderReviews() {
        const reviewsSlider = document.getElementById('reviews-slider');
        if (!reviewsSlider || !this.settings.reviews) return;

        const reviews = this.settings.reviews;
        const allReviews = [...reviews, ...reviews];

        reviewsSlider.innerHTML = '';
        allReviews.forEach(review => {
            const stars = '★'.repeat(review.stars);
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${review.text}"</p>
                <div class="review-author">
                    <strong>${review.author}</strong>
                </div>
            `;
            reviewsSlider.appendChild(reviewCard);
        });
    }

    async loadProjects() {
        try {
            const response = await fetch('./projects.json');
            if (!response.ok) throw new Error('Failed to load projects');
            this.projects = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('./products.json');
            if (!response.ok) throw new Error('Failed to load products');
            this.products = await response.json();
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';

        if (this.projects.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No projects to display yet. Add some projects to projects.json!</p>';
            return;
        }

        this.projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index, false);
            projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project, index, clickable = true) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-project-index', index);

        setTimeout(() => card.classList.add('visible'), index * 100);

        card.innerHTML = `
            <div class="project-image-container">
                <img src="${project.thumbnail}" alt="${project.title}" class="project-thumbnail" onerror="this.src='https://via.placeholder.com/400x220/f8fafb/666666?text=Image+Not+Found'">
            </div>
            <div class="project-type ${project.type}">${project.type}</div>
            <div class="project-info">
                <p class="project-description">${project.description}</p>
            </div>
        `;

        if (clickable) {
            card.addEventListener('click', () => this.openProjectModal(project));
            card.style.cursor = 'pointer';
        } else {
            card.style.cursor = 'default';
        }

        return card;
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        if (this.products.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No products to display yet. Add some products to products.json!</p>';
            return;
        }

        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        setTimeout(() => card.classList.add('visible'), index * 100);

        const priceDisplay = product.price === 0 || product.price === "free" ? 
            '<span class="product-price free">FREE</span>' : 
            `<span class="product-price paid">$${product.price}</span>`;

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200/f8fafb/666666?text=Image+Not+Found'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${priceDisplay}
            </div>
        `;

        card.addEventListener('click', () => this.openProductModal(product));

        return card;
    }

    renderStoreProducts() {
        const storeProductsGrid = document.getElementById('store-products-grid');
        if (!storeProductsGrid) return;

        storeProductsGrid.innerHTML = '';

        if (this.products.length === 0) {
            storeProductsGrid.innerHTML = '<p class="no-products">No products to display yet. Add some products to products.json!</p>';
            return;
        }

        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            storeProductsGrid.appendChild(productCard);
        });
    }

    openProjectModal(project) {
        const modal = document.getElementById('project-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalImages = document.getElementById('modal-images');
        const modalDescription = document.getElementById('modal-description');

        modalTitle.textContent = project.title;
        
        modalDescription.innerHTML = '';
        const descSection = document.createElement('div');
        descSection.className = 'description-section';
        descSection.innerHTML = `
            <div class="description-header">
                <div class="description-icon">📝</div>
                <h4 class="description-title">Project Description</h4>
            </div>
            <div id="modal-description">${project.description}</div>
            ${project.price ? `<div class="modal-price-display">Price: ${project.price}</div>` : ''}
        `;
        modalDescription.appendChild(descSection);

        modalImages.innerHTML = '';

        const imagesHeader = document.createElement('div');
        imagesHeader.className = 'images-header';
        imagesHeader.innerHTML = `
            <h4 class="images-title">Project Gallery</h4>
            <span class="image-counter">${project.images.length} image${project.images.length !== 1 ? 's' : ''}</span>
        `;
        modalImages.appendChild(imagesHeader);

        const imagesGrid = document.createElement('div');
        imagesGrid.className = 'images-grid';

        project.images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `${project.title} - Image ${index + 1}`;
            img.className = 'modal-image';
            img.setAttribute('data-index', index);
            img.style.animationDelay = `${index * 0.1}s`;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/150x120/f8fafb/666666?text=Image+Not+Found';
            };
            
            img.addEventListener('click', () => this.openLightbox(project.images, index));
            imagesGrid.appendChild(img);
        });

        modalImages.appendChild(imagesGrid);

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    openLightbox(images, startIndex) {
        this.currentImages = images;
        this.currentImageIndex = startIndex;
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        lightboxImg.src = images[startIndex];
        lightboxImg.onerror = function() {
            this.src = 'https://via.placeholder.com/800x600/f8fafb/666666?text=Image+Not+Found';
        };
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    nextImage() {
        if (this.currentImages.length > 0) {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.currentImages.length;
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = this.currentImages[this.currentImageIndex];
        }
    }

    prevImage() {
        if (this.currentImages.length > 0) {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.currentImages.length) % this.currentImages.length;
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = this.currentImages[this.currentImageIndex];
        }
    }

    openProductModal(product) {
        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('product-modal-title');
        const modalImages = document.getElementById('product-modal-images');
        const modalDescription = document.getElementById('product-modal-description');
        const modalPrice = document.getElementById('product-modal-price');
        const purchaseBtn = document.getElementById('product-purchase-btn');

        modalTitle.textContent = product.name;
        modalDescription.textContent = product.detailedDescription || product.description;
        
        if (product.price === 0 || product.price === "free") {
            modalPrice.textContent = 'FREE';
            modalPrice.className = 'modal-price free';
        } else {
            modalPrice.textContent = `$${product.price}`;
            modalPrice.className = 'modal-price paid';
        }

        modalImages.innerHTML = '';
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.className = 'product-modal-image';
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/400x250/f8fafb/666666?text=Image+Not+Found';
        };
        modalImages.appendChild(img);

        purchaseBtn.onclick = () => {
            if (product.purchaseLink) {
                window.open(product.purchaseLink, '_blank');
            }
        };

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeProductModal() {
        const modal = document.getElementById('product-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateProjectCount() {
        const projectCountElement = document.getElementById('project-count');
        if (projectCountElement) {
            projectCountElement.textContent = this.projects.length;
        }
    }

    setupEventListeners() {
        const hireMeBtn = document.getElementById('hire-me-btn');
        const discordModal = document.getElementById('discord-modal');
        const discordClose = document.getElementById('discord-close');
        const copyDiscordBtn = document.getElementById('copy-discord');

        if (hireMeBtn) {
            hireMeBtn.addEventListener('click', () => {
                this.switchScreen('landing');
            });
        }

        if (discordClose) {
            discordClose.addEventListener('click', () => {
                discordModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        if (discordModal) {
            discordModal.addEventListener('click', (e) => {
                if (e.target === discordModal) {
                    discordModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }

        if (copyDiscordBtn) {
            copyDiscordBtn.addEventListener('click', () => {
                const username = document.getElementById('discord-user').textContent;
                navigator.clipboard.writeText(username).then(() => {
                    copyDiscordBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyDiscordBtn.textContent = 'Copy';
                    }, 2000);
                });
            });
        }

        const closeModal = document.getElementById('close-modal');
        const modal = document.getElementById('project-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        const closeProductModal = document.getElementById('close-product-modal');
        const productModal = document.getElementById('product-modal');
        
        if (closeProductModal) {
            closeProductModal.addEventListener('click', () => this.closeProductModal());
        }
        
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) this.closeProductModal();
            });
        }

        const lightboxClose = document.getElementById('lightbox-close');
        const lightbox = document.getElementById('lightbox');
        const lightboxNext = document.getElementById('lightbox-next');
        const lightboxPrev = document.getElementById('lightbox-prev');

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => this.nextImage());
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => this.prevImage());
        }

        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.style.display === 'block') {
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'Escape') this.closeLightbox();
            }
            if (modal && modal.style.display === 'block') {
                if (e.key === 'Escape') this.closeModal();
            }
            
            const productModal = document.getElementById('product-modal');
            if (productModal && productModal.style.display === 'block') {
                if (e.key === 'Escape') this.closeProductModal();
            }
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const headerHeight = document.querySelector('.header').offsetHeight;
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            if (!current) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#home') {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

class FAQ {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleItem(item));
        });
    }

    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    new FAQ();
});
