class AssetViewer {
    constructor() {
        this.assets = [];
        this.filteredAssets = [];
        this.currentView = 'grid';
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.isLoading = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadAssets();
    }

    initializeElements() {
        // View elements
        this.gridView = document.getElementById('gridView');
        this.tableView = document.getElementById('tableView');
        this.assetGrid = document.getElementById('assetGrid');
        this.assetTableBody = document.getElementById('assetTableBody');
        this.emptyState = document.getElementById('emptyState');
        
        // Control elements
        this.gridViewBtn = document.getElementById('gridViewBtn');
        this.tableViewBtn = document.getElementById('tableViewBtn');
        this.filterType = document.getElementById('filterType');
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearch');
        this.loadingBadge = document.getElementById('loadingBadge');
        
        // Stats elements
        this.totalCount = document.getElementById('totalCount');
        this.brandsCount = document.getElementById('brandsCount');
        this.clientsCount = document.getElementById('clientsCount');
        this.projectsCount = document.getElementById('projectsCount');
        
        // Modal elements
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyLinkBtn = document.getElementById('copyLinkBtn');
        
        // Help modal elements
        this.helpModal = document.getElementById('helpModal');
        this.helpBtn = document.getElementById('helpBtn');
        this.helpModalClose = document.getElementById('helpModalClose');
    }

    attachEventListeners() {
        // View toggle
        this.gridViewBtn.addEventListener('click', () => this.setView('grid'));
        this.tableViewBtn.addEventListener('click', () => this.setView('table'));
        
        // Filter
        this.filterType.addEventListener('change', (e) => this.setFilter(e.target.value));
        
        // Search
        this.searchInput.addEventListener('input', (e) => this.setSearch(e.target.value));
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        
        // Modal
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
                this.closeModal();
            }
        });
        
        // Help modal
        this.helpBtn.addEventListener('click', () => this.showHelpModal());
        this.helpModalClose.addEventListener('click', () => this.closeHelpModal());
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal || e.target.classList.contains('modal-backdrop')) {
                this.closeHelpModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeHelpModal();
            }
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    async loadAssets() {
        this.setLoading(true);
        
        try {
            const response = await fetch('https://raw.githubusercontent.com/numerimondes/.github/main/assets/commons/config/assets-links.txt');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            this.assets = this.parseAssetLinks(text);
            this.applyFilters();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading assets:', error);
            this.showError('Failed to load assets. Please check your connection and try again.');
        } finally {
            this.setLoading(false);
        }
    }

    parseAssetLinks(text) {
        const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        const assets = [];
        
        lines.forEach(line => {
            const url = line.trim();
            if (url.startsWith('https://')) {
                const asset = this.parseAssetUrl(url);
                if (asset) {
                    assets.push(asset);
                }
            }
        });
        
        return assets;
    }

    parseAssetUrl(url) {
        try {
            // Parse GitHub raw URL to extract path information
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(part => part);
            
            // Expected format: /numerimondes/.github/main/assets/...
            if (pathParts.length < 4 || pathParts[0] !== 'numerimondes' || pathParts[1] !== '.github') {
                return null;
            }
            
            const assetPath = pathParts.slice(4).join('/'); // Remove 'numerimondes', '.github', 'main', 'assets'
            const fileName = pathParts[pathParts.length - 1];
            const pathSegments = assetPath.split('/');
            
            // Determine type based on path structure
            let type = 'projects'; // default
            if (pathSegments[0] === 'brands') {
                type = 'brands';
            } else if (pathSegments[0] === 'clients') {
                type = 'clients';
            }
            
            // Get file extension and size info
            const extension = fileName.split('.').pop().toLowerCase();
            const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'].includes(extension);
            const isDocument = ['pdf', 'doc', 'docx', 'txt', 'md'].includes(extension);
            const isCode = ['js', 'ts', 'css', 'html', 'json', 'xml'].includes(extension);
            
            return {
                id: this.generateId(url),
                name: fileName,
                path: assetPath,
                fullPath: url,
                type: type,
                extension: extension,
                isImage: isImage,
                isDocument: isDocument,
                isCode: isCode,
                category: this.getCategory(pathSegments),
                size: 'Unknown' // We can't determine size from URL alone
            };
        } catch (error) {
            console.error('Error parsing asset URL:', url, error);
            return null;
        }
    }

    generateId(url) {
        return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    getCategory(pathSegments) {
        if (pathSegments.length > 1) {
            return pathSegments[1]; // Second segment usually indicates category
        }
        return 'misc';
    }

    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.loadingBadge.classList.remove('hidden');
            this.showSkeletons();
        } else {
            this.loadingBadge.classList.add('hidden');
            this.hideSkeletons();
        }
    }

    showSkeletons() {
        this.assetGrid.innerHTML = Array(8).fill(0).map(() => 
            '<div class="skeleton"></div>'
        ).join('');
    }

    hideSkeletons() {
        if (this.currentView === 'grid') {
            this.renderGridView();
        } else {
            this.renderTableView();
        }
    }

    setView(view) {
        this.currentView = view;
        
        // Update button states
        this.gridViewBtn.classList.toggle('active', view === 'grid');
        this.tableViewBtn.classList.toggle('active', view === 'table');
        
        // Show/hide views with transition
        if (view === 'grid') {
            this.tableView.classList.add('hidden');
            this.gridView.classList.remove('hidden');
            this.renderGridView();
        } else {
            this.gridView.classList.add('hidden');
            this.tableView.classList.remove('hidden');
            this.renderTableView();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.applyFilters();
    }

    setSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.clearSearchBtn.classList.toggle('hidden', !query);
        this.applyFilters();
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.clearSearchBtn.classList.add('hidden');
        this.applyFilters();
    }

    applyFilters() {
        let filtered = this.assets;
        
        // Apply type filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(asset => asset.type === this.currentFilter);
        }
        
        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(asset => 
                asset.name.toLowerCase().includes(this.searchQuery) ||
                asset.path.toLowerCase().includes(this.searchQuery) ||
                asset.type.toLowerCase().includes(this.searchQuery) ||
                asset.category.toLowerCase().includes(this.searchQuery)
            );
        }
        
        this.filteredAssets = filtered;
        
        if (this.currentView === 'grid') {
            this.renderGridView();
        } else {
            this.renderTableView();
        }
        
        this.updateEmptyState();
    }

    renderGridView() {
        if (this.isLoading) return;
        
        if (this.filteredAssets.length === 0) {
            this.assetGrid.innerHTML = '';
            return;
        }
        
        this.assetGrid.innerHTML = this.filteredAssets.map(asset => this.createAssetCard(asset)).join('');
        
        // Add click listeners
        this.assetGrid.querySelectorAll('.asset-card').forEach((card, index) => {
            card.addEventListener('click', () => this.showAssetModal(this.filteredAssets[index]));
            
            // Add entrance animation
            setTimeout(() => {
                card.classList.add('card-enter');
            }, index * 50);
        });
    }

    renderTableView() {
        if (this.isLoading) return;
        
        this.assetTableBody.innerHTML = this.filteredAssets.map(asset => this.createTableRow(asset)).join('');
        
        // Add click listeners for preview buttons
        this.assetTableBody.querySelectorAll('.table-preview-btn').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAssetModal(this.filteredAssets[index]);
            });
        });
    }

    createAssetCard(asset) {
        const typeClass = asset.type;
        const preview = asset.isImage ? 
            `<img src="${asset.fullPath}" alt="${asset.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="asset-preview-placeholder" style="display:none;">📄</div>` :
            `<div class="asset-preview-placeholder">${this.getFileIcon(asset.extension)}</div>`;
        
        return `
            <div class="asset-card">
                <div class="asset-card-header">
                    <span class="asset-type-badge ${typeClass}">${asset.type}</span>
                </div>
                <div class="asset-preview">
                    ${preview}
                </div>
                <div class="asset-info">
                    <h3>${this.escapeHtml(asset.name)}</h3>
                    <p>${this.escapeHtml(asset.category)}</p>
                    <div class="asset-path">${this.escapeHtml(asset.path)}</div>
                </div>
            </div>
        `;
    }

    createTableRow(asset) {
        const typeClass = asset.type;
        
        return `
            <tr>
                <td>
                    <span class="asset-type-badge ${typeClass}">${asset.type}</span>
                </td>
                <td class="table-asset-name">${this.escapeHtml(asset.name)}</td>
                <td class="table-asset-path" title="${this.escapeHtml(asset.path)}">${this.escapeHtml(asset.path)}</td>
                <td>${asset.size}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-action-btn table-preview-btn">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Preview
                        </button>
                        <a href="${asset.fullPath}" class="table-action-btn" target="_blank" rel="noopener">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                            </svg>
                            Download
                        </a>
                    </div>
                </td>
            </tr>
        `;
    }

    updateStats() {
        const total = this.assets.length;
        const brands = this.assets.filter(asset => asset.type === 'brands').length;
        const clients = this.assets.filter(asset => asset.type === 'clients').length;
        const projects = this.assets.filter(asset => asset.type === 'projects').length;
        
        this.animateCounter(this.totalCount, total);
        this.animateCounter(this.brandsCount, brands);
        this.animateCounter(this.clientsCount, clients);
        this.animateCounter(this.projectsCount, projects);
    }

    animateCounter(element, target) {
        const current = parseInt(element.textContent) || 0;
        const increment = Math.ceil((target - current) / 20);
        
        if (current < target) {
            element.textContent = Math.min(current + increment, target);
            setTimeout(() => this.animateCounter(element, target), 50);
        }
    }

    updateEmptyState() {
        const isEmpty = this.filteredAssets.length === 0 && !this.isLoading;
        this.emptyState.classList.toggle('hidden', !isEmpty);
    }

    showAssetModal(asset) {
        this.modalTitle.textContent = asset.name;
        
        let previewContent = '';
        
        if (asset.isImage) {
            previewContent = `
                <div class="modal-preview">
                    <img src="${asset.fullPath}" alt="${this.escapeHtml(asset.name)}" />
                </div>
            `;
        } else {
            previewContent = `
                <div class="modal-preview">
                    <div style="font-size: 4rem; color: var(--secondary-text);">
                        ${this.getFileIcon(asset.extension)}
                    </div>
                </div>
            `;
        }
        
        const infoContent = `
            <div class="modal-info">
                <h4>Asset Information</h4>
                <p><strong>Name:</strong> ${this.escapeHtml(asset.name)}</p>
                <p><strong>Type:</strong> ${this.escapeHtml(asset.type)}</p>
                <p><strong>Category:</strong> ${this.escapeHtml(asset.category)}</p>
                <p><strong>Path:</strong> <code>${this.escapeHtml(asset.path)}</code></p>
                <p><strong>Extension:</strong> ${this.escapeHtml(asset.extension)}</p>
                <p><strong>Size:</strong> ${asset.size}</p>
            </div>
        `;
        
        this.modalBody.innerHTML = previewContent + infoContent;
        
        // Set up download and copy buttons
        this.downloadBtn.onclick = () => this.downloadAsset(asset);
        this.copyLinkBtn.onclick = () => this.copyAssetLink(asset);
        
        this.modal.classList.remove('hidden');
        this.modal.querySelector('.modal-content').classList.add('modal-enter');
        
        setTimeout(() => {
            this.modal.querySelector('.modal-content').classList.add('active');
        }, 10);
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.modal.querySelector('.modal-content').classList.remove('modal-enter', 'active');
    }

    showHelpModal() {
        this.helpModal.classList.remove('hidden');
        this.helpModal.querySelector('.modal-content').classList.add('modal-enter');
        
        setTimeout(() => {
            this.helpModal.querySelector('.modal-content').classList.add('active');
        }, 10);
    }

    closeHelpModal() {
        this.helpModal.classList.add('hidden');
        this.helpModal.querySelector('.modal-content').classList.remove('modal-enter', 'active');
    }

    downloadAsset(asset) {
        const link = document.createElement('a');
        link.href = asset.fullPath;
        link.download = asset.name;
        link.target = '_blank';
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async copyAssetLink(asset) {
        try {
            await navigator.clipboard.writeText(asset.fullPath);
            
            // Show feedback
            const originalText = this.copyLinkBtn.innerHTML;
            this.copyLinkBtn.innerHTML = `
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Copied!
            `;
            
            setTimeout(() => {
                this.copyLinkBtn.innerHTML = originalText;
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy link:', error);
            
            // Fallback: show the link for manual copying
            const textArea = document.createElement('textarea');
            textArea.value = asset.fullPath;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show feedback
            const originalText = this.copyLinkBtn.innerHTML;
            this.copyLinkBtn.innerHTML = `
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Copied!
            `;
            
            setTimeout(() => {
                this.copyLinkBtn.innerHTML = originalText;
            }, 2000);
        }
    }

    getFileIcon(extension) {
        const iconMap = {
            // Images
            'png': '🖼️',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'gif': '🖼️',
            'svg': '🎨',
            'webp': '🖼️',
            'bmp': '🖼️',
            'ico': '🖼️',
            
            // Documents
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'txt': '📄',
            'md': '📄',
            'rtf': '📄',
            
            // Code
            'js': '⚡',
            'ts': '⚡',
            'html': '🌐',
            'css': '🎨',
            'json': '📋',
            'xml': '📋',
            'yaml': '📋',
            'yml': '📋',
            
            // Archives
            'zip': '📦',
            'rar': '📦',
            '7z': '📦',
            'tar': '📦',
            'gz': '📦',
            
            // Audio
            'mp3': '🎵',
            'wav': '🎵',
            'ogg': '🎵',
            'm4a': '🎵',
            
            // Video
            'mp4': '🎥',
            'avi': '🎥',
            'mov': '🎥',
            'wmv': '🎥',
            
            // Default
            'default': '📄'
        };
        
        return iconMap[extension.toLowerCase()] || iconMap.default;
    }

    showError(message) {
        this.assetGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--accent-red);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="margin: 0 0 0.5rem 0; color: var(--primary-text);">Error Loading Assets</h3>
                <p style="margin: 0; color: var(--secondary-text);">${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--accent-blue); color: var(--primary-bg); border: none; border-radius: 0.375rem; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AssetViewer();
});

// Initialize highlight.js for code syntax highlighting
document.addEventListener('DOMContentLoaded', () => {
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
});
