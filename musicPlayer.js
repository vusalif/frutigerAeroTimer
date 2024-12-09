// Music Player functionality
document.addEventListener('DOMContentLoaded', function() {
    const musicPlayer = document.getElementById('musicPlayer');
    const dragHandle = document.getElementById('dragHandle');
    const playButton = document.querySelector('.wheel-button.play');
    const nextButton = document.querySelector('.wheel-button.forward');
    const prevButton = document.querySelector('.wheel-button.back');
    const menuButton = document.querySelector('.wheel-button.menu');
    const nowPlaying = document.getElementById('now-playing');
    const trackArtist = document.getElementById('track-artist');
    const minimizeBtn = document.getElementById('minimizePlayer');
    const openIpodBtn = document.getElementById('open-ipod');
    const durationSlider = document.querySelector('.duration-slider');
    const currentTimeDisplay = document.querySelector('.current-time');
    const totalDurationDisplay = document.querySelector('.total-duration');
    
    let currentPlaylist = [];
    let currentTrackIndex = 0;
    let isPlaying = false;
    let audio = new Audio();
    let currentVolume = 0.5; // Default volume (50%)
    let isDraggingSlider = false;

    // Hide iPod initially
    musicPlayer.style.display = 'none';

    // Open iPod button handler
    openIpodBtn.addEventListener('click', () => {
        if (!musicPlayer.classList.contains('visible')) {
            musicPlayer.classList.add('visible');
            
            // Only position if no saved position exists
            if (!localStorage.getItem('ipodPosition')) {
                centerIpod();
            } else {
                const savedPosition = JSON.parse(localStorage.getItem('ipodPosition'));
                musicPlayer.style.left = savedPosition.left;
                musicPlayer.style.top = savedPosition.top;
                musicPlayer.style.transform = 'none'; // Remove centering transform
            }
        } else {
            localStorage.setItem('ipodPosition', JSON.stringify({
                left: musicPlayer.style.left,
                top: musicPlayer.style.top
            }));
            musicPlayer.classList.remove('visible');
        }
    });

    // Add centering function
    function centerIpod() {
        const container = document.querySelector('.glass-panel');
        const containerRect = container.getBoundingClientRect();
        
        // Center position
        const left = (containerRect.width - 300) / 2;
        const top = (containerRect.height - 400) / 2;
        
        musicPlayer.style.left = `${left}px`;
        musicPlayer.style.top = `${top}px`;
        musicPlayer.style.transform = 'none'; // Remove the default centering transform
    }

    // Dragging functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    // Load playlist
    fetch('frutigerRadio/frutigerAreo/playlist.json')
    fetch('frutigerRadio/lofi/playlist.json')
    fetch('frutigerRadio/relax/playlist.json')
        .then(response => response.json())
        .then(playlist => {
            currentPlaylist = playlist;
            updateDisplay();
        })
        .catch(error => console.error('Error loading playlist:', error));

    function startDragging(e) {
        const dragHandleTop = dragHandle;
        const dragHandleBottom = document.getElementById('dragHandleBottom');
        
        // Check if clicking either the top or bottom handle
        if (dragHandleTop.contains(e.target) || dragHandleBottom.contains(e.target)) {
            isDragging = true;
            const musicPlayerRect = musicPlayer.getBoundingClientRect();
            initialX = e.clientX - musicPlayerRect.left;
            initialY = e.clientY - musicPlayerRect.top;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            const container = document.querySelector('.glass-panel');
            const containerRect = container.getBoundingClientRect();
            
            // Calculate new position relative to container
            let newX = e.clientX - initialX - containerRect.left;
            let newY = e.clientY - initialY - containerRect.top;
            
            // Allow movement anywhere within the glass panel
            // Just ensure at least 20px of the iPod remains within view
            const minVisible = 20;
            const maxX = containerRect.width - minVisible;
            const maxY = containerRect.height - minVisible;
            
            // Allow negative positions but ensure part of iPod is always visible
            newX = Math.max(-musicPlayer.offsetWidth + minVisible, Math.min(newX, maxX));
            newY = Math.max(-musicPlayer.offsetHeight + minVisible, Math.min(newY, maxY));
            
            musicPlayer.style.left = `${newX}px`;
            musicPlayer.style.top = `${newY}px`;
            
            localStorage.setItem('ipodHasBeenMoved', 'true');
            localStorage.setItem('ipodPosition', JSON.stringify({
                left: musicPlayer.style.left,
                top: musicPlayer.style.top
            }));
        }
    }

    function stopDragging() {
        isDragging = false;
    }

    function updateDisplay() {
        if (currentPlaylist.length > 0) {
            const track = currentPlaylist[currentTrackIndex];
            nowPlaying.textContent = track.title;
            trackArtist.textContent = track.artist || 'Unknown Artist';
        } else {
            nowPlaying.textContent = 'No track playing';
            trackArtist.textContent = 'Unknown Artist';
        }
    }

    function playTrack() {
        if (currentPlaylist.length > 0) {
            const track = currentPlaylist[currentTrackIndex];
            const albumPath = track.album === 'lofi' 
                ? 'frutigerRadio/lofi/'
                : track.album === 'relax'
                    ? 'frutigerRadio/relax/'
                    : 'frutigerRadio/frutigerAreo/';
            audio.src = albumPath + track.filename;
            audio.play();
            isPlaying = true;
            playButton.textContent = '⏸';
            updateDisplay();
        }
    }

    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        playButton.textContent = '▶';
    }

    // Event Listeners
    dragHandle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    playButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    nextButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
        if (isPlaying) playTrack();
        else updateDisplay();
    });

    prevButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        if (isPlaying) playTrack();
        else updateDisplay();
    });

    // Minimize/Restore functionality
    minimizeBtn.addEventListener('click', () => {
        // Save position before hiding
        localStorage.setItem('ipodPosition', JSON.stringify({
            left: musicPlayer.style.left,
            top: musicPlayer.style.top
        }));
        musicPlayer.classList.remove('visible');
    });

    // Handle track ending
    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
        playTrack();
    });

    // Update window resize handler
    window.addEventListener('resize', () => {
        if (musicPlayer.style.display !== 'none') {
            const container = document.querySelector('.glass-panel');
            const containerRect = container.getBoundingClientRect();
            const minVisible = 20;
            
            let currentLeft = parseInt(musicPlayer.style.left);
            let currentTop = parseInt(musicPlayer.style.top);
            
            const maxX = containerRect.width - minVisible;
            const maxY = containerRect.height - minVisible;
            
            // Keep at least part of the iPod visible
            currentLeft = Math.max(-musicPlayer.offsetWidth + minVisible, Math.min(currentLeft, maxX));
            currentTop = Math.max(-musicPlayer.offsetHeight + minVisible, Math.min(currentTop, maxY));
            
            musicPlayer.style.left = `${currentLeft}px`;
            musicPlayer.style.top = `${currentTop}px`;
            
            localStorage.setItem('ipodPosition', JSON.stringify({
                left: musicPlayer.style.left,
                top: musicPlayer.style.top
            }));
        }
    });

    // Add albums menu HTML
    const albumsMenu = document.createElement('div');
    albumsMenu.className = 'albums-menu';
    albumsMenu.innerHTML = `
        <div class="albums-menu-header">
            <span>Albums</span>
            <button class="close-albums-menu">×</button>
        </div>
        <div class="albums-list">
            <div class="album-item" data-album="frutiger">Frutiger Aero</div>
            <div class="album-item" data-album="lofi">Lo-Fi</div>
            <div class="album-item" data-album="relax">Relax</div>
        </div>
    `;
    document.body.appendChild(albumsMenu);

    // Add CSS for albums menu
    const style = document.createElement('style');
    style.textContent = `
        .albums-menu {
            position: fixed;
            background: linear-gradient(160deg, #e2e2e2 0%, #c8c8c8 47%, #b8b8b8 100%);
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            display: none;
            min-width: 200px;
        }

        .albums-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .close-albums-menu {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #666;
        }

        .album-item {
            padding: 0.5rem;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.2s;
        }

        .album-item:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Menu button click handler
    menuButton.addEventListener('click', () => {
        const playerRect = musicPlayer.getBoundingClientRect();
        albumsMenu.style.display = 'block';
        albumsMenu.style.left = `${playerRect.right + 10}px`;
        albumsMenu.style.top = `${playerRect.top}px`;
    });

    // Close menu button handler
    document.querySelector('.close-albums-menu').addEventListener('click', () => {
        albumsMenu.style.display = 'none';
    });

    // Album selection handler
    document.querySelectorAll('.album-item').forEach(item => {
        item.addEventListener('click', () => {
            const album = item.dataset.album;
            loadAlbum(album);
            albumsMenu.style.display = 'none';
        });
    });

    // Load album function
    function loadAlbum(albumName) {
        const path = albumName === 'lofi' 
            ? 'frutigerRadio/lofi/playlist.json'
            : albumName === 'relax'
                ? 'frutigerRadio/relax/playlist.json'
                : 'frutigerRadio/frutigerAreo/playlist.json';
        fetch(path)
            .then(response => response.json())
            .then(playlist => {
                currentPlaylist = playlist;
                currentTrackIndex = 0;
                updateDisplay();
                if (isPlaying) {
                    playTrack();
                }
            })
            .catch(error => console.error('Error loading playlist:', error));
    }

    // Click outside to close menu
    document.addEventListener('click', (e) => {
        if (!albumsMenu.contains(e.target) && 
            !menuButton.contains(e.target) && 
            albumsMenu.style.display === 'block') {
            albumsMenu.style.display = 'none';
        }
    });

    // Add event listener for bottom handle
    const dragHandleBottom = document.getElementById('dragHandleBottom');
    dragHandleBottom.addEventListener('mousedown', startDragging);

    // Add this after creating the audio object
    audio.volume = currentVolume;

    // Add this after other event listeners in DOMContentLoaded
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeDisplay = document.querySelector('.volume-display');

    // Load saved volume
    const savedVolume = localStorage.getItem('ipodVolume');
    if (savedVolume !== null) {
        currentVolume = parseFloat(savedVolume);
        audio.volume = currentVolume;
        volumeSlider.value = currentVolume * 100;
        volumeDisplay.textContent = `${Math.round(currentVolume * 100)}%`;
    }

    // Volume slider event listener
    volumeSlider.addEventListener('input', (e) => {
        currentVolume = e.target.value / 100;
        audio.volume = currentVolume;
        volumeDisplay.textContent = `${e.target.value}%`;
        localStorage.setItem('ipodVolume', currentVolume);
    });

    // Add this after your other event listeners
    const volumeIcon = document.querySelector('.volume-icon');
    const volumePopup = document.querySelector('.volume-popup');

    // Toggle volume popup
    volumeIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        volumePopup.classList.toggle('show');
    });

    // Update volume icon based on level
    function updateVolumeIcon() {
        const icon = document.querySelector('.volume-icon');
        if (currentVolume === 0) {
            icon.textContent = '🔇';
        } else if (currentVolume < 0.3) {
            icon.textContent = '🔈';
        } else if (currentVolume < 0.7) {
            icon.textContent = '🔉';
        } else {
            icon.textContent = '🔊';
        }
    }

    // Update the volume slider event listener
    volumeSlider.addEventListener('input', (e) => {
        currentVolume = e.target.value / 100;
        audio.volume = currentVolume;
        volumeDisplay.textContent = `${e.target.value}%`;
        localStorage.setItem('ipodVolume', currentVolume);
        updateVolumeIcon();
    });

    // Close volume popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!volumePopup.contains(e.target) && !volumeIcon.contains(e.target)) {
            volumePopup.classList.remove('show');
        }
    });

    // Initialize volume icon
    updateVolumeIcon();

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateDurationSlider() {
        if (!isDraggingSlider && audio.duration) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            durationSlider.value = percentage;
            durationSlider.style.background = `linear-gradient(to right, #8e9ba6 0%, #8e9ba6 ${percentage}%, #e2e2e2 ${percentage}%, #e2e2e2 100%)`;
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        }
    }

    // Update audio time when slider is moved
    durationSlider.addEventListener('input', (e) => {
        isDraggingSlider = true;
        const time = (audio.duration / 100) * e.target.value;
        currentTimeDisplay.textContent = formatTime(time);
        durationSlider.style.background = `linear-gradient(to right, #8e9ba6 0%, #8e9ba6 ${e.target.value}%, #e2e2e2 ${e.target.value}%, #e2e2e2 100%)`;
    });

    durationSlider.addEventListener('change', (e) => {
        isDraggingSlider = false;
        const time = (audio.duration / 100) * e.target.value;
        audio.currentTime = time;
    });

    // Update duration display when metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        totalDurationDisplay.textContent = formatTime(audio.duration);
        durationSlider.value = 0;
        durationSlider.style.background = 'linear-gradient(to right, #8e9ba6 0%, #8e9ba6 0%, #e2e2e2 0%, #e2e2e2 100%)';
    });

    // Update time display during playback
    audio.addEventListener('timeupdate', updateDurationSlider);
});
