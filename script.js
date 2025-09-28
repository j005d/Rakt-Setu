
    // Sample donor data (keep for search functionality)
    const donorsData = [
      {
        id: 1,
        name: "John Doe",
        bloodType: "O+",
        location: "Mumbai, Maharashtra",
        distance: "2.5 km",
        verified: true,
        lastDonation: "3 months ago",
        availability: "Available"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        bloodType: "A-",
        location: "Delhi, NCR",
        distance: "5.1 km",
        verified: true,
        lastDonation: "6 months ago",
        availability: "Available"
      },
      {
        id: 3,
        name: "Mike Chen",
        bloodType: "B+",
        location: "Bangalore, Karnataka",
        distance: "1.8 km",
        verified: true,
        lastDonation: "4 months ago",
        availability: "Available"
      },
      {
        id: 4,
        name: "Priya Sharma",
        bloodType: "AB+",
        location: "Chennai, Tamil Nadu",
        distance: "3.2 km",
        verified: true,
        lastDonation: "5 months ago",
        availability: "Available"
      }
    ];

    // DOM Elements
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Language translations
    const translations = {
      en: {
        title: "The Future of Blood Donation is Here",
        subtitle: "AI-powered matching, real-time availability, emergency alerts, and a supportive donor community at your fingertips."
      },
      hi: {
        title: "रक्तदान का भविष्य यहाँ है",
        subtitle: "AI-संचालित मैचिंग, रीयल-टाइम उपलब्धता, आपातकालीन अलर्ट, और एक सहायक दाता समुदाय।"
      },
      es: {
        title: "El Futuro de la Donación de Sangre está Aquí",
        subtitle: "Coincidencias impulsadas por IA, disponibilidad en tiempo real, alertas de emergencia y una comunidad de donantes solidaria."
      },
      fr: {
        title: "L'Avenir du Don de Sang est Là",
        subtitle: "Correspondance alimentée par IA, disponibilité en temps réel, alertes d'urgence et une communauté de donneurs solidaire."
      }
    };

    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
      initializeApp();
      setupEventListeners();
    });

    function initializeApp() {
      // Add smooth scrolling for on-page sections
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      // Initialize search results with sample data
      displaySearchResults(donorsData);

      // Add loading animations
      const cards = document.querySelectorAll('.feature-card, .donor-card, .security-card, .review-card');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
      });
    }

    function setupEventListeners() {
      // Search form submission
      searchForm.addEventListener('submit', handleSearch);

      // Modal form submissions
      document.getElementById('loginForm').addEventListener('submit', handleLogin);
      document.getElementById('donorForm').addEventListener('submit', handleDonorRegistration);
      document.getElementById('emergencyForm').addEventListener('submit', handleEmergencyRequest);

      // Language selector
      document.getElementById('languageBtn').addEventListener('click', toggleLanguageDropdown);
      document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', changeLanguage);
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
          document.getElementById('languageDropdown').style.display = 'none';
        }
      });
    }

    function handleSearch(e) {
      e.preventDefault();
      
      const formData = new FormData(searchForm);
      const searchParams = {
        bloodType: formData.get('bloodType') || document.getElementById('bloodType').value,
        location: formData.get('location') || document.getElementById('location').value,
        distance: formData.get('distance') || document.getElementById('distance').value
      };

      // Show loading
      searchResults.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="matching-animation" style="margin: 0 auto;"></div><p>Searching for donors...</p></div>';

      // Simulate search delay
      setTimeout(() => {
        const filteredDonors = filterDonors(donorsData, searchParams);
        displaySearchResults(filteredDonors);
        
        showToast(
          `Found ${filteredDonors.length} donors matching your criteria`,
          'success'
        );
      }, 1500);
    }

    function filterDonors(donors, params) {
      return donors.filter(donor => {
        const matchesBloodType = !params.bloodType || donor.bloodType === params.bloodType;
        const matchesLocation = !params.location || 
          donor.location.toLowerCase().includes(params.location.toLowerCase());
        const matchesDistance = !params.distance || 
          parseFloat(donor.distance) <= parseFloat(params.distance);
        
        return matchesBloodType && matchesLocation && matchesDistance;
      });
    }

    function displaySearchResults(donors) {
      if (donors.length === 0) {
        searchResults.innerHTML = `
          <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
            <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <p>No donors found matching your criteria. Try adjusting your search parameters.</p>
            <button class="btn primary" onclick="activateEmergency()">
              <i class="fas fa-exclamation-triangle"></i> Try Emergency Mode
            </button>
          </div>
        `;
        return;
      }

      searchResults.innerHTML = donors.map(donor => `
        <div class="donor-card">
          <div class="donor-info">
            <div class="avatar">${donor.name.charAt(0)}</div>
            <div>
              <h4>${donor.name}</h4>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <span class="blood-type">${donor.bloodType}</span>
                ${donor.verified ? '<span class="verified-badge"><i class="fas fa-check"></i> Verified</span>' : ''}
              </div>
            </div>
          </div>
          <div style="margin-bottom: 1rem;">
            <p><i class="fas fa-map-marker-alt"></i> ${donor.location}</p>
            <p><i class="fas fa-route"></i> ${donor.distance} away</p>
            <p><i class="fas fa-clock"></i> Last donation: ${donor.lastDonation}</p>
            <p><i class="fas fa-circle" style="color: var(--success);"></i> ${donor.availability}</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <button class="btn primary" onclick="contactDonor(${donor.id})">
              <i class="fas fa-phone"></i> Contact
            </button>
            <button class="btn secondary" onclick="viewProfile(${donor.id})">
              <i class="fas fa-user"></i> Profile
            </button>
          </div>
        </div>
      `).join('');
    }

    function handleLogin(e) {
      e.preventDefault();
      // Simulate login process
      showToast('Login successful! Welcome back.', 'success');
      closeModal('loginModal');
    }

    function handleDonorRegistration(e) {
      e.preventDefault();
      // Simulate registration process
      showToast('Registration successful! Please check your email for verification.', 'success');
      closeModal('donorModal');
    }

    function handleEmergencyRequest(e) {
      e.preventDefault();
      // Simulate emergency alert
      showToast('Emergency alert sent to 150 nearby donors!', 'success');
      closeModal('emergencyModal');
      
      // Show emergency animation
      setTimeout(() => {
        showToast('3 donors have responded to your emergency request!', 'success');
      }, 3000);
    }

    function activateEmergency() {
      openModal('emergencyModal');
    }

    function showToast(message, type = 'success') {
      toast.className = `toast ${type}`;
      toastMessage.textContent = message;
      
      // Update icon based on type
      const icon = toast.querySelector('i');
      switch(type) {
        case 'success':
          icon.className = 'fas fa-check-circle';
          break;
        case 'error':
          icon.className = 'fas fa-exclamation-circle';
          break;
        case 'info':
          icon.className = 'fas fa-info-circle';
          break;
        default:
          icon.className = 'fas fa-check-circle';
      }
      
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }

    // Modal functions
    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Language functions
    function toggleLanguageDropdown() {
      const dropdown = document.getElementById('languageDropdown');
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }

    function changeLanguage(e) {
      const lang = e.target.dataset.lang;
      const langBtn = document.getElementById('languageBtn');
      const flag = e.target.textContent.split(' ')[0];
      
      langBtn.innerHTML = `<i class="fas fa-globe"></i> ${flag}`;
      document.getElementById('languageDropdown').style.display = 'none';
      
      // Update content based on selected language
      if (translations[lang]) {
        document.querySelector('.hero-content h1').textContent = translations[lang].title;
        document.querySelector('.hero-content p').textContent = translations[lang].subtitle;
      }
      
      showToast(`Language changed to ${e.target.textContent}`, 'success');
    }

    // Utility functions
    function scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        if (event.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    }

    // Add navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
      }
      
      // Add background blur when scrolled
      if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      }
      
      lastScrollTop = scrollTop;
    });

    // Add typing effect to hero title
    function typeWriter(element, text, speed = 100) {
      let i = 0;
      element.textContent = '';
      
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      
      type();
    }

    // Initialize typing effect on load
    setTimeout(() => {
      const heroTitle = document.querySelector('.hero-content h1');
      const originalText = heroTitle.textContent;
      typeWriter(heroTitle, originalText, 50);
    }, 1000);
  