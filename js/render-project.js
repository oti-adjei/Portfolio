 document.addEventListener('DOMContentLoaded', loadPageData);

        // --- HEADER SCRIPT ---
        const header = document.querySelector("header");
        window.addEventListener("scroll", function() {
            header.classList.toggle("sticky", window.scrollY > 0);
        });

        const menuIcon = document.querySelector("#menu-icon");
        const navlist = document.querySelector(".navlist");

        menuIcon.onclick = () => {
            menuIcon.classList.toggle("bx-x");
            navlist.classList.toggle("active");
        };

        function goBack() {
            window.history.length > 1 ? window.history.back() : window.location.href = 'case-studies.html'; // Or your main projects page
        }

        // --- MAIN DATA FETCHING AND RENDERING SCRIPT ---
        async function loadPageData() {
            try {
                const response = await fetch('../data/projects.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const allProjects = await response.json();
                const urlParams = new URLSearchParams(window.location.search);
                const projectId = urlParams.get('id');

                if (!projectId) {
                    document.querySelector('.main-content').innerHTML = `<h1>No Project ID Provided</h1>`;
                    return;
                }
                
                const currentProject = allProjects.find(p => p.id === projectId);

                if (!currentProject) {
                    document.querySelector('.main-content').innerHTML = `<h1>Project Not Found</h1>`;
                    return;
                }
                
                // Render both the main project and the "other projects" section
                renderProjectDetails(currentProject);
                renderOtherProjects(allProjects, projectId);

            } catch (error) {
                console.error("Could not load project data:", error);
                document.querySelector('.main-content').innerHTML = `<h1>Error Loading Project Data</h1>`;
            }
        }

        /**
         * Renders the details for the main project on the page.
         */
        function renderProjectDetails(project) {
            document.title = `Case Study: ${project.title}`;
            document.getElementById('case-tag').textContent = project.type ? project.type.toUpperCase() : 'CASE STUDY';
            document.getElementById('project-title').textContent = project.title;
            document.getElementById('timeframe').textContent = `Timeframe: ${project.timeframe}`;
            
            const projectButton = document.getElementById('project-button');
            if (project.project_url) {
                projectButton.href = project.project_url;
                projectButton.style.display = 'inline-block';
            } else {
                projectButton.style.display = 'none';
            }

            document.getElementById('project-intro').textContent = project.introParagraph;
            document.getElementById('client-overview').textContent = project.clientOverview;
            document.getElementById('challenge').textContent = project.challenge;
            document.getElementById('takeaways').textContent = project.takeaways;

            const solutionsList = document.getElementById('solutions-list');
            solutionsList.innerHTML = '';
            project.solutions.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `• ${item}`;
                solutionsList.appendChild(li);
            });

            const statsContainer = document.getElementById('stats-container');
            statsContainer.innerHTML = '';
            statsContainer.parentElement.style.display = 'none'; // Hide by default
            if (project.stats && project.stats.length > 0) {
                statsContainer.parentElement.style.display = 'block'; // Show if stats exist
                project.stats.forEach(stat => {
                    const card = document.createElement('div');
                    card.className = 'stat-card';
                    card.innerHTML = `<div class="value">${stat.value}</div><div class="label">${stat.label}</div>`;
                    statsContainer.appendChild(card);
                });
            }

            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = '';
            imageContainer.className = project.type === 'web' ? 'web-layout' : 'mobile-layout';
            project.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${project.title} screenshot`;
                imageContainer.appendChild(img);
            });
        }

        /**
         * Renders 3 random projects, excluding the current one.
         */
        function renderOtherProjects(allProjects, currentProjectId) {
            const otherProjects = allProjects.filter(p => p.id !== currentProjectId);

            // Shuffle the array
            for (let i = otherProjects.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [otherProjects[i], otherProjects[j]] = [otherProjects[j], otherProjects[i]];
            }

            const selectedProjects = otherProjects.slice(0, 3);
            const container = document.getElementById('other-products-container');
            container.innerHTML = '';

            selectedProjects.forEach(project => {
                const projectLink = `project-details-template.html?id=${project.id}`;
                const imageUrl = project.images[0];
                const title = project.title;
                const description = project.tags && project.tags.length > 0 ? project.tags[0] : (project.category || 'View Details');

                const cardHTML = `
                    <a href="${projectLink}" class="product-card">
                        <img src="${imageUrl}" alt="${title}">
                        <div class="layer">
                            <div>
                                <h4>${title}</h4>
                                <p>${description}</p>
                            </div>
                        </div>
                    </a>
                `;
                container.innerHTML += cardHTML;
            });
        }