"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const url = "https://www.linkedin.com/";
const waitefunction = (t) => __awaiter(void 0, void 0, void 0, function* () {
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("done");
        }, t * 1000);
    });
    return p;
});
class LinkedinUser {
    constructor(e, p) {
        this.email = e;
        this.password = p;
        this.browser = null;
        this.page = null;
        this.pageurl = null;
        this.commentsprofiles = [];
        this.commentsonpost = {};
        this.allemailsofposts = {};
    }
    Login() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            if (!this.browser)
                return { error: "browser not found" };
            try {
                this.page = yield this.browser.newPage();
                yield this.page.goto(url);
                let email = yield this.page.$('#session_key');
                let password = yield this.page.$('#session_password');
                yield (email === null || email === void 0 ? void 0 : email.type(this.email));
                yield (password === null || password === void 0 ? void 0 : password.type(this.password));
                let login = yield this.page.$('.sign-in-form__submit-btn--full-width');
                // handle error
                if (!login) {
                    console.log("login button not found");
                    return { error: "Internal server error" };
                }
                yield (login === null || login === void 0 ? void 0 : login.click());
                yield waitefunction(5);
                //go to profile 
                let profilephoto = yield this.page.$('.feed-identity-module__member-photo');
                if (!profilephoto) {
                    return { error: "invalid credentials or profile not found" };
                }
                yield (profilephoto === null || profilephoto === void 0 ? void 0 : profilephoto.click());
                yield waitefunction(3);
                return {};
            }
            catch (err) {
                console.log(err);
                return { error: "error occured while logging in" };
            }
        });
    }
    fetchprofiles(n) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            * return all the profiles who commented on the nth post
            * store the profiles in this.commentsprofiles
            */
            let response = yield this.Login();
            if (response.error) {
                return response;
            }
            try {
                if (!this.page) {
                    console.log("page not found");
                    return { error: "Internal server error" };
                }
                yield waitefunction(3);
                yield this.page.goto(this.page.url() + "recent-activity/all");
                // wait for the page to load 
                yield waitefunction(5);
                let posts = yield this.page.$$(".feed-shared-update-v2--minimal-padding");
                // make a new promise
                if (posts.length > 0) {
                    let p = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        yield Promise.all(posts.map((e, index) => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b;
                            let element = yield e.$(".feed-shared-update-v2__content");
                            if (!element) {
                                console.log("element not found");
                                return;
                            }
                            if (index == n - 1) {
                                element === null || element === void 0 ? void 0 : element.click();
                                // get comments name
                                yield waitefunction(5);
                                //getting the people profile link who commented
                                let commentersanchors = yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.$$(".comments-post-meta__actor-link"));
                                if (!commentersanchors || commentersanchors.length == 0) {
                                    resolve({ error: "No comments found" });
                                    return;
                                }
                                //finding the href of their linkedin accounts
                                for (let element of commentersanchors) {
                                    const href = yield ((_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(el => el.getAttribute('href'), element));
                                    if (href) {
                                        this.commentsprofiles.push(href === null || href === void 0 ? void 0 : href.toString());
                                    }
                                }
                                resolve({ profiles: this.commentsprofiles });
                            }
                        })));
                    }));
                    return p;
                }
            }
            catch (err) {
                console.log("error occured while fetching profiles");
                return { error: "error occured while fetching profiles" };
            }
        });
    }
    fetchcomments(n) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            * return all the comments on the nth post
            * store the comments in this.commentsonpost[nthpost]
            */
            var _a;
            try {
                let comments = yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.$$(".comments-comment-item__main-content"));
                if (!comments || comments.length == 0) {
                    return { error: "comments not found" };
                }
                let p = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    for (let element of comments) {
                        let commentspan = yield element.$("span");
                        if (!commentspan) {
                            continue;
                        }
                        let comment = yield ((_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(el => el.textContent, commentspan));
                        if (!comment) {
                            continue;
                        }
                        if (!this.commentsonpost[n]) {
                            this.commentsonpost[n] = [];
                        }
                        this.commentsonpost[n].push(comment);
                    }
                    resolve("done");
                }));
                yield p;
                return { comments: this.commentsonpost[n] };
            }
            catch (err) {
                console.log("error occured while fetching comments");
                return { error: "error occcured while fetching comments" };
            }
        });
    }
    fetchemails(n) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * return all emails of the people who commented on the post
             * store the emails in this.allemailsofposts[keyword]
             */
            try {
                let emails = [];
                // going to each profile page and getting email 
                let p = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    for (let element of this.commentsprofiles) {
                        //going to profile page
                        yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.goto(element));
                        yield waitefunction(3);
                        // getting contact info
                        yield ((_b = this.page) === null || _b === void 0 ? void 0 : _b.goto(this.page.url() + "overlay/contact-info/"));
                        yield waitefunction(5);
                        //getting container having email
                        let emailcontainers = yield ((_c = this.page) === null || _c === void 0 ? void 0 : _c.$$(".pv-contact-info__contact-type"));
                        // extracting email from container
                        let isemailfound = false;
                        if (emailcontainers && emailcontainers.length > 0) {
                            for (let element of emailcontainers) {
                                let anchor = yield element.$("a");
                                if (!anchor) {
                                    continue;
                                }
                                const href = yield ((_d = this.page) === null || _d === void 0 ? void 0 : _d.evaluate(el => el.getAttribute('href'), anchor));
                                if (href === null || href === void 0 ? void 0 : href.toString().endsWith(".com")) {
                                    emails.push(href.split(":")[1]);
                                    isemailfound = true;
                                }
                            }
                        }
                        if (!isemailfound) {
                            emails.push("");
                        }
                    }
                    resolve('done');
                }));
                yield p;
                this.allemailsofposts[n] = emails;
                return { emails: this.allemailsofposts[n] };
            }
            catch (err) {
                return { error: "error occured while fetching emails" };
            }
        });
    }
    get_emails_from_keyword(n, keyword) {
        if (!this.allemailsofposts[n]) {
            return;
        }
        let indexes = [];
        for (let i = 0; i < this.commentsonpost[n].length; i++) {
            if (this.commentsonpost[n][i].toLowerCase().includes(keyword.toLowerCase())) {
                console.log(this.commentsonpost[n][i], keyword);
                indexes.push(i);
            }
        }
        return this.allemailsofposts[n].filter((e, i) => indexes.includes(i));
    }
}
function main(username, password, postnumber, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = new LinkedinUser(username, password);
            console.log("user created");
            // LATEST POST HAST LOWEST NUMBER I.E. 1  OLDEST POST HAS HIGHEST NUMBER
            // GIVE SAME POST NUMBER IN BELOW 3 FUNCTIONS OTHERWISE THEY WILL NOT WORK
            let profiles = yield user.fetchprofiles(postnumber);
            if (!profiles || profiles.error) {
                return profiles;
            }
            let comments = yield user.fetchcomments(postnumber);
            if (comments.error) {
                return comments;
            }
            let emails = yield user.fetchemails(postnumber);
            if (emails.error) {
                return emails;
            }
            let filteredemails = user.get_emails_from_keyword(postnumber, keyword);
            if (!filteredemails) {
                return { error: "no emails with this keyword found" };
            }
            return filteredemails;
        }
        catch (err) {
            return { error: "internal server error" };
        }
    });
}
exports.default = main;
