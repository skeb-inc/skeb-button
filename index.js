'use strict';

const GENRES = {
    art: "イラスト",
    voice: "ボイス",
    novel: "テキスト",
    video: "ムービー",
    music: "ミュージック",
    correction: "アドバイス"
};

function applyCurrentTwitter() {
    const profile = document.querySelector("[data-testid='UserProfileHeader_Items']");
    if (!profile) {
        return;
    }
    const items = profile.getElementsByClassName("skeb");
    const uid = getTwitterUserId();

    if (!uid || !uid.match(/[0-9]*/g)) {
        for (let i = 0; i < items.length; ++i) {
            profile.removeChild(items[i]);
        }
        return;
    }

    if (document.body.getAttribute("data-uid") === uid) {
        return;
    }

    for (let i = 0; i < items.length; ++i) {
        profile.removeChild(items[i]);
    }

    document.body.setAttribute("data-uid", uid);
    sendRequest(uid, (data) => {
        const descriptions = buildDescription(data);
        const sub = buildSubDescription(data);
        const skeb = '<div style="display:block;" class="skeb css-901oao r-1fmj7o5"><a href="https://skeb.jp/@' + data.screen_name + '" target="_blank" role="link" data-focusable="true" class="skeb css-4rbku5 css-18t94o4 css-901oao css-16my406 r-13gxpu9 r-1loqt21 r-4qtqp9 r-gwet1z r-ad9z0x r-zso239 r-bcqeeo r-qvutc0" rel=" noopener noreferrer"><svg viewBox="0 0 24 24" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-7o8qx1 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><rect x="7.59" y="4.44" transform="matrix(0.3231 -0.9464 0.9464 0.3231 0.3479 11.7668)" width="1.61" height="2.41"/><rect x="6.04" y="9" transform="matrix(0.3231 -0.9464 0.9464 0.3231 -5.0223 13.3813)" width="1.61" height="2.41"/><rect x="4.48" y="13.56" transform="matrix(0.3231 -0.9464 0.9464 0.3231 -10.3938 14.9961)" width="1.61" height="2.41"/><path  d="M12,0C5.37,0,0,5.37,0,12s5.37,12,12,12s12-5.37,12-12S18.63,0,12,0z M13.76,4.98L8,21.88 c-0.4-0.16-0.78-0.35-1.16-0.55l4.43-12.9l0.03-0.1l1.06-3.12l0.23-0.69L9.56,3.5L9.3,4.25l1.52,0.52L9.79,7.81L8.26,7.29 L7.74,8.81l1.52,0.52l-1.03,3.04l-1.52-0.52l-0.54,1.52l1.52,0.52l-1.03,3.04l-1.52-0.51l-0.51,1.53l1.52,0.52l-0.68,1.96 c-0.23-0.18-0.45-0.36-0.66-0.56l0.34-0.9l-1.68-0.57C2.13,16.6,1.34,14.39,1.34,12C1.34,6.11,6.11,1.34,12,1.34 c4.37,0,8.12,2.63,9.76,6.38L13.76,4.98z"/></g></svg><strong style="margin-left:4px;">' + descriptions.join('<div dir="auto" aria-hidden="true" class="css-901oao r-111h2gw r-1q142lx r-gwet1z r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-ou255f r-qvutc0"><span class="css-901oao css-16my406 r-gwet1z r-ad9z0x r-bcqeeo r-qvutc0">·</span></div>') + '</strong></a></br>' + sub + '</div>';
        profile.insertAdjacentHTML("afterbegin", skeb);
    })
}

function applyPreviousTwitter() {
    const profile = document.querySelector(".ProfileHeaderCard");
    if (!profile) {
        return;
    }

    const items = profile.getElementsByClassName("skeb");
    const placementTracking = document.querySelector(".ProfileCanopy");
    if (!placementTracking) {
        for (let i = 0; i < items.length; ++i) {
            profile.removeChild(items[i]);
        }
        return;
    }

    const tracker = placementTracking.querySelector("[data-user-id]");
    if (!tracker) {
        return;
    }

    const uid = tracker.getAttribute("data-user-id");
    if (!uid || document.body.getAttribute("data-uid") === uid) {
        return;
    }
    document.body.setAttribute("data-uid", uid);

    for (let i = 0; i < items.length; ++i) {
        profile.removeChild(items[i]);
    }

    const bio = profile.querySelector(".ProfileHeaderCard-bio");
    sendRequest(uid, (data) => {
        const descriptions = buildDescription(data);
        const skeb = '<div class="ProfileHeaderCard-url skeb"><span class="Icon Icon--medium" aria-hidden="true" role="presentation"><svg viewBox="0 0 24 24" style="fill: #2be0a8;"><g><rect x="7.59" y="4.44" transform="matrix(0.3231 -0.9464 0.9464 0.3231 0.3479 11.7668)" width="1.61" height="2.41"/><rect x="6.04" y="9" transform="matrix(0.3231 -0.9464 0.9464 0.3231 -5.0223 13.3813)" width="1.61" height="2.41"/><rect x="4.48" y="13.56" transform="matrix(0.3231 -0.9464 0.9464 0.3231 -10.3938 14.9961)" width="1.61" height="2.41"/><path  d="M12,0C5.37,0,0,5.37,0,12s5.37,12,12,12s12-5.37,12-12S18.63,0,12,0z M13.76,4.98L8,21.88 c-0.4-0.16-0.78-0.35-1.16-0.55l4.43-12.9l0.03-0.1l1.06-3.12l0.23-0.69L9.56,3.5L9.3,4.25l1.52,0.52L9.79,7.81L8.26,7.29 L7.74,8.81l1.52,0.52l-1.03,3.04l-1.52-0.52l-0.54,1.52l1.52,0.52l-1.03,3.04l-1.52-0.51l-0.51,1.53l1.52,0.52l-0.68,1.96 c-0.23-0.18-0.45-0.36-0.66-0.56l0.34-0.9l-1.68-0.57C2.13,16.6,1.34,14.39,1.34,12C1.34,6.11,6.11,1.34,12,1.34 c4.37,0,8.12,2.63,9.76,6.38L13.76,4.98z"/></g></svg></span><span class="ProfileHeaderCard-urlText"><a class="u-textUserColor" target="_blank" rel="me nofollow noopener" href="https://skeb.jp/@' + data.screen_name + '" title="https://skeb.jp/@' + data.screen_name + '"><strong>' + descriptions.join("　") + '</strong></a></span></div>';
        bio.insertAdjacentHTML("afterend", skeb);
    })
}

function sendRequest(uid, success) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status !== 200) {
            return;
        }

        const data = JSON.parse(xhr.responseText);
        success(data);
    };
    xhr.open("GET", "https://skeb.jp/api/users/exists?twitter_uid=" + uid);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
}

function buildDescription(data) {
    const descriptions = [];

    if (data.banned) {
        descriptions.push("凍結済み")
        return descriptions
    }

    if (data.acceptable) {
        descriptions.push(`${GENRES[data.skills[0].genre]} ${data.skills[0].default_amount.toLocaleString()}円`);
    } else if (data.agreed_creator_guidelines && data.received_works_count > 0) {
        descriptions.push("停止中");
    }
    if (!descriptions.length) {
        if (data.sent_public_works_count > 0) {
            descriptions.push(`${data.sent_public_works_count.toLocaleString()}件の取引実績があるクライアント`);
        } else {
            descriptions.push("登録済み");
        }
    }
    return descriptions;
}

function buildSubDescription(data) {
    const descriptions = [];
    if (data.banned) {
        return descriptions
    }
    if (data.acceptable) {
        const other_genres = data.skills.slice(1).map((skill) => `${GENRES[skill.genre]}`)
        if (other_genres.length) {
            descriptions.push(`そのほか募集中のジャンル：${other_genres.join('/')}`);
        }
    }
    if (data.agreed_creator_guidelines && data.received_works_count > 0) {
        descriptions.push(`納品: ${data.received_works_count.toLocaleString()}件`);
    }
    return descriptions.join("</br>")
}

function getTwitterUserId() {
    return getUserIdFromPlacementTracking() || getUserIdFromPrimaryColumn() || getUserIdFromScript() || null
}

function getUserIdFromPlacementTracking() {
    const placementTracking = document.querySelector("[data-testid='placementTracking']");
    if (!placementTracking) {
        return null;
    }
    const tracker = placementTracking.querySelector("[data-testid]");
    if (!tracker) {
        return null;
    }
    return tracker.getAttribute("data-testid").split("-")[0];
}

function getUserIdFromPrimaryColumn() {
    const primaryColumn = document.querySelector("[data-testid='primaryColumn']");
    if (!primaryColumn) {
        return null;
    }
    const regex = /https:\/\/pbs.twimg.com\/profile_banners\/[0-9]*\//g;
    const profileBanners = primaryColumn.innerHTML.match(regex);
    if (!profileBanners) {
        return null;
    }
    return profileBanners[0].slice(38, -1);
}

function getUserIdFromScript() {
    try {
        const scriptArray = Array.from(document.getElementsByTagName('script'));
        const initialState = scriptArray.find(function (element) {
            return element.innerHTML.startsWith('window.__INITIAL_STATE__');
        });
        const jsonString = initialState.innerHTML.replace("window.__INITIAL_STATE__=", "");
        const jsonEndIndex = jsonString.indexOf(';')
        const parseString = jsonString.slice(0, (jsonEndIndex - jsonString.length))
        const json = JSON.parse(parseString)
        return json.session.user_id;
    } catch (e) {
        return null;
    }
}

const current = !document.getElementById("swift_action_queue");
const observer = new MutationObserver(current ? applyCurrentTwitter : applyPreviousTwitter)
observer.observe(document.body, { childList: true, subtree: true });
