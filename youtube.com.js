let mutationObserver;

function isYoutubeVideoURL(url) {
    const pattern = /youtube.com\/watch\?v=.+/;

    return pattern.test(url);
}

function startAutoReplayBadge(url) {
    let autoplayToggled = false;

    function createBadge() {
        const badge = document.createElement("div");
        const badgeId = "yar-badge";

        badge.id = badgeId;
        badge.classList.add(badgeId);

        badge.addEventListener("click", function () {
            if (this.classList.contains("toggle")) {
                this.classList.remove("toggle");

                autoplayToggled = false;
            } else {
                this.classList.add("toggle");
                autoplayToggled = true;
            }
        });

        document.body.appendChild(badge);

        return badge;
    }

    function observeYoutubePlayer() {
        const youtubePlayer = document.querySelector(".html5-video-player");

        if (mutationObserver) {
            mutationObserver.disconnect();
        }

        mutationObserver = new MutationObserver((mutations) => {
            mutations.map((mutation) => {
                if (mutation.attributeName === "class") {
                    const classList = youtubePlayer.classList;

                    if (
                        !(
                            classList.contains("playing-mode") ||
                            classList.contains("paused-mode")
                        )
                    ) {
                        if (
                            autoplayToggled &&
                            isYoutubeVideoURL(window.location.href)
                        ) {
                            document
                                .querySelector(".ytp-play-button.ytp-button")
                                .click();
                            debugger;
                        }
                    }
                }
            });
        });

        mutationObserver.observe(youtubePlayer, {
            attributes: true,
        });
    }

    createBadge();
    observeYoutubePlayer();
}

function clearBadge() {
    const badge = document.getElementById("yar-badge");

    if (badge) {
        document.body.removeChild(badge);
    }
}

function handleAutoReplay() {
    const currentURL = window.location.href;

    clearBadge();

    if (isYoutubeVideoURL(currentURL)) {
        startAutoReplayBadge();
    }
}

window.addEventListener("yt-page-data-updated", handleAutoReplay, true);
