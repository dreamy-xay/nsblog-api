import {Request, Response} from "express";

const {timestampToTime} = require('../helper/date')
const {Article, Article_tag, A_at, Article_category, A_ac} = require('../article/article.model')

async function articleCreate(req: Request, res: Response) {
    console.log(req.body)
    const {
        articleId,
        reviewPermission,
        type,
        status,
        content,
        accessPermission,
        summary,
        sharingAgreement,
        passwordProtection,
        title,
        coverImage,
        priority,
        categories,
        tags,
        friendChain,
    } = req.body
    console.log(timestampToTime(new Date().getTime()))

    if (articleId === null) {
        const article = await Article.create({
            review_permission: reviewPermission,
            type,
            status,
            release_time: timestampToTime(new Date().getTime()),
            content,
            access_permission: accessPermission,
            summary,
            sharing_agreement: sharingAgreement,
            oppose_count: 0,
            recommend_count: 0,
            password_protection: passwordProtection,
            title,
            cover_image: coverImage,
            priority
        })

        for (const category of categories) {
            const findCategory = await Article_category.findOne({
                where: {
                    article_category_id: category.id,
                    name: category.value
                }
            });
            if (findCategory) {
                await A_ac.create({
                    article_id: article.article_id,
                    article_category_id: findCategory.article_category_id
                })
            }
        }

        for (const tag of tags) {
            const findTag = await Article_tag.findOne({where: {name: tag}});
            if (findTag) {
                await A_at.create({
                    article_id: article.article_id,
                    article_tag_id: findTag.article_tag_id
                })
            } else {
                const newTag = await Article_tag.create({name: tag})
                await A_at.create({
                    article_id: article.article_id,
                    article_tag_id: newTag.article_tag_id
                })
            }
        }

        return res.send({article_id: article.article_id})
    } else {
        const article = await Article.findOne({article_id: articleId})
        if (article) {
            article.review_permission = reviewPermission
            article.type = type
            article.status = status
            article.content = content
            article.access_permission = accessPermission
            article.summary = summary
            article.sharing_agreement = sharingAgreement
            article.password_protection = passwordProtection
            article.title = title
            article.cover_image = coverImage
            article.priority = priority
        }
        await article.save()

        return res.send({article_id: article.article_id})
    }
}

async function tagGet(req: Request, res: Response) {
    const category = await Article_tag.findAll()
    const array: never[] = []
    for (const e of category) {
        // @ts-ignore
        array.push({id: e.article_tag_id, value: e.name})
    }
    return res.send(array)
}

async function categoryGet(req: Request, res: Response) {
    const category = await Article_category.findAll()
    const array: never[] = []
    for (const e of category) {
        // @ts-ignore
        array.push({id: e.article_category_id, value: e.name})
    }
    return res.send(array)
}

async function categoryCreate(req: Request, res: Response) {
    const {name} = req.body

    const findCategory = await Article_category.findOne({where: {name}});
    if (findCategory)
        return res.status(403).send({message: "username duplicate"})

    const category = await Article_category.create({name})
    return res.send({article_category_id: category.article_category_id})
}

module.exports = {
    articleCreate,
    tagGet,
    categoryGet,
    categoryCreate
};
