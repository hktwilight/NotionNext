import React, { useCallback, useEffect } from 'react'
import { ArticleLock } from './components/ArticleLock'
import HeaderArticle from './components/HeaderArticle'
import LayoutBase from './LayoutBase'
import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import { ArticleInfo } from './components/ArticleInfo'
import Catalog from './components/Catalog'
import JumpToCommentButton from './components/JumpToCommentButton'
import throttle from 'lodash.throttle'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  const [show, switchShow] = React.useState(false)
  const throttleMs = 200

  const scrollListener = useCallback(throttle(() => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 220 && post?.toc?.length > 0
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }, throttleMs))
  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [])

  if (!post) {
    return <LayoutBase
            headerSlot={<HeaderArticle {...props} />}
            {...props}
            showCategory={false}
            showTag={false}
        ></LayoutBase>
  }

  return (<LayoutBase
        headerSlot={<HeaderArticle {...props} />}
        {...props}
        showCategory={false}
        showTag={false}
    >

        <div id='inner-wrapper'>
            <div className={'w-full lg:max-w-3xl 2xl:max-w-4xl'}>
                <div className="-mt-32 rounded-md mx-3 lg:border lg:rounded-xl lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">
                    {lock && <ArticleLock validPassword={validPassword} />}

                    {!lock && <div id="container" className="overflow-x-auto md:w-full px-3 ">
                        {post?.type && post?.type === 'Post' && <>
                            <div
                                data-aos="fade-down"
                                data-aos-duration="100"
                                data-aos-once="false"
                                data-aos-anchor-placement="top-center"
                                className='px-10'>
                                <ArticleInfo post={post} />
                            </div>
                            <hr />
                        </>}

                        <div className='lg:px-10 subpixel-antialiased'>
                            <article itemScope >
                                {/* Notion文章主体 */}
                                <section id='notion-article' className='justify-center mx-auto max-w-2xl lg:max-w-full'>
                                    {post && <NotionPage post={post} />}
                                </section>


                                {/* 文章版权说明 */}
                                {post.type === 'Post' && <ArticleCopyright {...props} />}

                            </article>

                            <hr className='border-dashed' />

                            {/* 评论互动 */}
                            <div className="overflow-x-auto dark:bg-hexo-black-gray px-3">
                                <Comment frontMatter={post} />
                            </div>
                        </div>

                    </div>}
                </div>

                {/* 文章推荐 */}
                {post.type === 'Post' && <ArticleAdjacent {...props} />}

                {/* 文章目录 */}
                {post?.toc?.length > 0 && <div id='toc-wrapper' style={{ zIndex: '-1' }} className='absolute top-0 w-full h-full xl:block hidden lg:max-w-3xl 2xl:max-w-4xl' >
                    <div data-aos-delay="200"
                        data-aos="fade-down"
                        data-aos-duration="200"
                        data-aos-once="true"
                        data-aos-anchor-placement="top-center"
                        className='relative h-full'>
                        <div className='float-right xl:-mr-72 xl:w-72 w-56 -mr-56 h-full mt-40'>
                            <div className='sticky top-24'>
                                <Catalog toc={post.toc} />
                            </div>
                        </div>
                    </div>
                </div>}

            </div>

            <div className='fixed bottom-28 right-4'>
                <JumpToCommentButton />
            </div>

        </div>

    </LayoutBase>
  )
}
