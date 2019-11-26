export default {
  methods: {
    _tagColor () {
      // 红、蓝、绿、橙、灰
      const tagColorArr = ['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87', '#e15b64', '#f47e60', '#f8b26a', '#f26d6d', '#67cc86', '#fb9b5f', '#3498db']
      const index = Math.floor(Math.random() * tagColorArr.length)
      return tagColorArr[index]
    },
    _filterPostData (posts, isTimeline) {
      const stickyArr = []
      posts = posts.filter(item => {
        const { title, frontmatter: { home, date, publish, sticky }} = item
        if (sticky) {
          stickyArr.unshift(item)
          return false
        }
        return isTimeline === true
          ? !(home == true || title == undefined || date === undefined || publish === false)
          : !(home == true || title == undefined || publish === false)
      })
      return stickyArr.concat(posts)
    },
    _sortPostData (posts) {
      posts.sort((a, b) => {
        let aTop = a.frontmatter.top, bTop=b.frontmatter.top;
        if(aTop && bTop) {
          return aTop == bTop ? (this._getTimeNum(b) - this._getTimeNum(a)) : (aTop - bTop)
        } else if(aTop && !bTop) {
          return -1;
        } else if(!aTop && bTop){
          return 1;
        }
        return this._getTimeNum(b) - this._getTimeNum(a)
      })
    },
    // 获取时间的数字类型
    _getTimeNum (date) {
      return parseInt(new Date(date.frontmatter.date).getTime())
    },
    // 获取博客数据
    _getPostData () {
      return new Promise(resolve => {
        if (!this.$themeConfig.posts) {
          const {
            $categories: { list: articles },
            _filterPostData,
            _sortPostData
          } = this

          let posts = articles.reduce((allData, currnetData) => {
            return [...allData, ...currnetData.pages]
          }, [])

          _sortPostData(posts)
          posts = _filterPostData(posts)

          this.$themeConfig.posts = posts
          resolve(posts)
        }
      })
    },
    // 获取当前页码
    _getStoragePage () {
      const path = window.location.pathname
      const currentPage = JSON.parse(sessionStorage.getItem('currentPage'))

      if (currentPage === null || path !== currentPage.path) {
        sessionStorage.setItem('currentPage', { page: 1, path: '' })
        return 1
      }

      return parseInt(currentPage.page)
    },
    // 设置当前页码
    _setStoragePage (page) {
      const path = window.location.pathname
      sessionStorage.setItem('currentPage', JSON.stringify({ page, path }))
    }
  }
}
