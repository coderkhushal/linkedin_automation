const puppeteer = require('puppeteer-extra')
import { Browser, Page, executablePath } from "puppeteer"
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const url = "https://www.linkedin.com/"
const waitefunction = async (t: number) => {
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("done")
        }, t * 1000)
    })
    return p
}

class LinkedinUser {
    email: string
    password: string
    browser: Browser | null

    page: Page | null
    commentsonpost: { [key: string]: string[] }
    allemailsofposts: { [key: string]: string[] }
    pageurl: string | null
    commentsprofiles: string[]
    constructor(e: string, p: string) {
        this.email = e
        this.password = p
        this.browser = null
        this.page = null
        this.pageurl = null
        this.commentsprofiles = []
        this.commentsonpost = {}
        this.allemailsofposts = {}
    }
    async Login(): Promise<{ error?: string }> {

        this.browser = await puppeteer.launch({ headless: false, args:['--no-sandbox', '--disable-setuid-sandbox']})
        if (!this.browser) return { error: "browser not found" };
        try {

            this.page = await this.browser.newPage()
            await this.page.goto(url)
            let email = await this.page.$('#session_key')
            let password = await this.page.$('#session_password')
            await email?.type(this.email)
            await password?.type(this.password)
            let login = await this.page.$('.sign-in-form__submit-btn--full-width')
            // handle error
            if (!login) {
                console.log("login button not found")
                return { error: "Internal server error" }
            }

            await login?.click()

            await waitefunction(5)



            //go to profile 
            let profilephoto = await this.page.$('.feed-identity-module__member-photo')
            if (!profilephoto) {
                return { error: "invalid credentials or profile not found" }
            }
            await profilephoto?.click()
            await waitefunction(3)
            return {}
        }

        catch (err) {
            console.log(err)
            return { error: "error occured while logging in" }
        }
    }

    async fetchprofiles(n: number): Promise<{ error?: String, profiles?: string[] } | undefined> {
        /* 
        * return all the profiles who commented on the nth post
        * store the profiles in this.commentsprofiles
        */



        let response = await this.Login()
        
        if (response.error) {
            return response
        }
        try {

            if (!this.page) {
                console.log("page not found")
                return { error: "Internal server error" }
            }
            await waitefunction(3);

            await this.page.goto(this.page.url() + "recent-activity/all")
            // wait for the page to load 
            await waitefunction(5)
            let posts = await this.page.$$(".feed-shared-update-v2--minimal-padding")
            // make a new promise

            if (posts.length > 0) {

                let p = new Promise<{ error?: String, profiles?: string[] } | undefined>(async (resolve, reject) => {
                    await Promise.all(
                        posts.map(async (e, index) => {
                            let element = await e.$(".feed-shared-update-v2__content")

                            if (!element) {
                                console.log("element not found")
                                return
                            }
                            if (index == n - 1) {
                                element?.click()
                                // get comments name
                                await waitefunction(5);

                                //getting the people profile link who commented
                                let commentersanchors = await this.page?.$$(".comments-post-meta__actor-link")
                                if (!commentersanchors || commentersanchors.length == 0) {

                                    resolve({ error: "No comments found" })
                                    return;
                                }


                                //finding the href of their linkedin accounts
                                for (let element of commentersanchors) {
                                    const href = await this.page?.evaluate(el => el.getAttribute('href'), element);


                                    if (href) {

                                        this.commentsprofiles.push(href?.toString())
                                    }
                                }

                                resolve({ profiles: this.commentsprofiles })

                            }

                        })
                    )
                })
                return p

            }
        }
        catch (err) {
            console.log("error occured while fetching profiles")
            return { error: "error occured while fetching profiles" }
        }

    }
    async fetchcomments(n: number): Promise<{ comments?: string[], error?: string }> {
        /*
        * return all the comments on the nth post 
        * store the comments in this.commentsonpost[nthpost]
        */



        try {

            let comments = await this.page?.$$(".comments-comment-item__main-content")
            if (!comments || comments.length == 0) { return { error: "comments not found" } }
            let p = new Promise(async (resolve, reject) => {



                for (let element of comments) {
                    let commentspan = await element.$("span")
                    if (!commentspan) { continue; }
                    let comment = await this.page?.evaluate(el => el.textContent, commentspan);
                    if (!comment) { continue; }
                    if (!this.commentsonpost[n]) {
                        this.commentsonpost[n] = []
                    }

                    this.commentsonpost[n].push(comment)
                }
                resolve("done")
            })
            await p
            return { comments: this.commentsonpost[n] };
        }
        catch (err) {
            console.log("error occured while fetching comments")
            return { error: "error occcured while fetching comments" }
        }


    }
    async fetchemails(n: number): Promise<{ emails?: string[], error?: string }> {
        /**
         * return all emails of the people who commented on the post
         * store the emails in this.allemailsofposts[keyword] 
         */

        try {


            let emails: string[] = []
            // going to each profile page and getting email 
            let p = new Promise(async (resolve, reject) => {

                for (let element of this.commentsprofiles) {

                    //going to profile page
                    await this.page?.goto(element)
                    await waitefunction(3)

                    // getting contact info
                    await this.page?.goto(this.page.url() + "overlay/contact-info/")
                    await waitefunction(5)

                    //getting container having email
                    let emailcontainers = await this.page?.$$(".pv-contact-info__contact-type")

                    // extracting email from container
                    let isemailfound = false
                    if (emailcontainers && emailcontainers.length > 0) {
                        for (let element of emailcontainers) {
                            let anchor = await element.$("a")
                            if (!anchor) { continue; }
                            const href = await this.page?.evaluate(el => el.getAttribute('href'), anchor);

                            if (href?.toString().endsWith(".com")) {

                                emails.push(href.split(":")[1])
                                isemailfound = true
                            }

                        }
                    }
                    if (!isemailfound) {
                        emails.push("")
                    }


                }
                resolve('done')
            })
            await p;
            this.allemailsofposts[n] = emails

            return { emails: this.allemailsofposts[n] }
        }
        catch (err) {
            return { error: "error occured while fetching emails" }
        }
    }


    get_emails_from_keyword(n: number, keyword: string) {
        if (!this.allemailsofposts[n]) {
            return;
        }
        let indexes = []

        for (let i = 0; i < this.commentsonpost[n].length; i++) {
            if (this.commentsonpost[n][i].toLowerCase().includes(keyword.toLowerCase())) {
                console.log(this.commentsonpost[n][i], keyword)
                indexes.push(i)
            }
        }
        return this.allemailsofposts[n].filter((e, i) => indexes.includes(i))
    }



}



async function main(username: string, password: string, postnumber: number, keyword: string) {
    try {

        let user = new LinkedinUser(username, password)
        console.log("user created")
        // LATEST POST HAST LOWEST NUMBER I.E. 1  OLDEST POST HAS HIGHEST NUMBER
        // GIVE SAME POST NUMBER IN BELOW 3 FUNCTIONS OTHERWISE THEY WILL NOT WORK
        let profiles = await user.fetchprofiles(postnumber)

        if (!profiles || profiles.error) {
            return profiles
        }
        let comments = await user.fetchcomments(postnumber)
        if (comments.error) {
            return comments
        }
        let emails = await user.fetchemails(postnumber)
        if (emails.error) {
            return emails
        }


        let filteredemails = user.get_emails_from_keyword(postnumber, keyword)
        if (!filteredemails) {

            return { error: "no emails with this keyword found" }
        }

        return filteredemails
    }
    catch (err) {

        return { error: "internal server error" }
    }

}
export default main
