// Load data from JSON files
async function loadData() {
    try {
        const [profileData, educationData, experienceData, projectsData] = await Promise.all([
            fetch('data/profile.json').then(res => res.json()),
            fetch('data/education.json').then(res => res.json()),
            fetch('data/experience.json').then(res => res.json()),
            fetch('data/projects.json').then(res => res.json())
        ]);
        
        renderProfile(profileData);
        renderSkills(profileData.skills);
        renderEducation(educationData);
        renderExperience(experienceData);
        renderProjects(projectsData);
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render Profile Section
function renderProfile(data) {
    const desc = document.getElementById('profile-description');
    if (desc) desc.textContent = data.description;
    
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        profilePic.src = data.profileImage;
        profilePic.alt = data.name;
    }
    
    const sidebarAvatar = document.getElementById('sidebar-avatar-img');
    if (sidebarAvatar) sidebarAvatar.src = data.profileImage;

    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');

    if (contactEmail) contactEmail.textContent = data.email;
    if (contactPhone) contactPhone.textContent = data.phone;

    const socialLinks = document.getElementById('social-links');
    if (socialLinks && data.socialMedia) {
        data.socialMedia.forEach(social => {
            const link = document.createElement('a');
            link.href = social.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', social.platform);
            link.innerHTML = `<i class="fab fa-${social.platform.toLowerCase()}"></i>`;
            socialLinks.appendChild(link);
        });
        
        // Add email to social links as well
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${data.email}`;
        emailLink.setAttribute('aria-label', 'Email');
        emailLink.innerHTML = `<i class="fas fa-envelope"></i>`;
        socialLinks.appendChild(emailLink);
    }

    if (data.cv) {
        const cvLink = document.getElementById('cv-download');
        if (cvLink) {
            cvLink.href = data.cv.file;
            cvLink.setAttribute('download', '');
        }
    }
}

// Render Skills
function renderSkills(skillsData) {
    if (!skillsData) return;
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;

    const allSkills = [
        ...skillsData.technical.map(s => ({...s, type: 'Technical'})),
        ...skillsData.soft.map(s => ({...s, type: 'Soft Skill'}))
    ];

    allSkills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <div class="skill-icon"><i class="${skill.icon}"></i></div>
            <div class="skill-name">${skill.name}</div>
            <div class="skill-desc">${skill.type}</div>
            ${skill.level ? `
                <div class="skill-proficiency">
                    <span>Proficiency</span>
                    <span>${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-bar-fill" data-width="${skill.level}%"></div>
                </div>
            ` : ''}
        `;
        skillsGrid.appendChild(card);
    });
}

// Render Education
function renderEducation(data) {
    const educationList = document.getElementById('education-list');
    if (!educationList) return;
    
    data.forEach(edu => {
        const item = document.createElement('div');
        item.className = 'journey-item';
        item.innerHTML = `
            <div class="journey-header-with-logo">
                ${edu.logo ? `<img src="${edu.logo}" alt="${edu.university} logo" class="journey-logo">` : ''}
                <div class="journey-header-content">
                    <div class="journey-duration">${edu.year}</div>
                    <h4 class="journey-title">${edu.university}</h4>
                    <div class="journey-subtitle">${edu.major}</div>
                </div>
            </div>
            <p class="journey-desc">${edu.description}</p>
        `;
        educationList.appendChild(item);
    });
}

// Render Experience
function renderExperience(data) {
    const experienceList = document.getElementById('experience-list');
    if (!experienceList) return;
    
    data.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'journey-item';
        item.innerHTML = `
            <div class="journey-header-with-logo">
                ${exp.logo ? `<img src="${exp.logo}" alt="${exp.company} logo" class="journey-logo">` : ''}
                <div class="journey-header-content">
                    <div class="journey-duration">${exp.year}</div>
                    <h4 class="journey-title">${exp.company}</h4>
                    <div class="journey-subtitle">${exp.position}</div>
                </div>
            </div>
            <p class="journey-desc">${exp.description}</p>
        `;
        experienceList.appendChild(item);
    });
}

// Projects section starts next

// Render Projects
function renderProjects(data) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='images/profile.png'">
            </div>
            <div class="project-year">${project.year} // ${project.role}</div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            ${project.link && project.link !== '#' ? `<a href="${project.link}" class="project-link" target="_blank">VIEW PROJECT <i class="fas fa-arrow-right"></i></a>` : ''}
        `;
        projectsGrid.appendChild(card);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', loadData);

// UI Interactions
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(current)) {
                link.classList.add('active');
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.getElementById('mobile-menu-btn');
            if (sidebar) sidebar.classList.remove('open');
        });
    });

    document.querySelectorAll('.btn-discover').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.id === 'skills') {
                    const bars = entry.target.querySelectorAll('.skill-bar-fill');
                    bars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        if (width) {
                            setTimeout(() => {
                                bar.style.width = width;
                            }, 300);
                        }
                    });
                }
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});