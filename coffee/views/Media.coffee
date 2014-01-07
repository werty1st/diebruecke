class MediaView
    hasBeenOpened: false

    constructor: (name, media, isMobile) ->
        @name = name
        @media = media
        @isMobile = isMobile

        @el = document.createElement('div')
        @el.setAttribute 'id', 'broen-gallery-person-media'
        @el.innerHTML = this.html()

        this.addEvents()
        return @el

    addEvents: ->
        bindEvent @el, 'click', (e) =>
            target = if e.target then e.target else window.event.srcElement
            if e.preventDefault then e.preventDefault() else e.returnValue = false

            if target.tagName.toLowerCase() is 'img'
                this.initSlider() unless @hasBeenOpened

                target = $(target)
                if target.getParent().hasClass 'image-wrap'
                    target = target.getParent()

                index = target.getParent().getChildren().indexOf(target) 
                this.openSlider(index)

            else if target.className is 'dr-link-readmore dr-icon-close'
                this.closeSlider()

    initSlider: ->
        @slider = document.getElementById 'broen-gallery-person-media-slider'
        @slider.innerHTML = this.getSliderHTML()

    openSlider: (index) ->
        @slider.className = ''
        if @isMobile then document.body.className = 'broen'

        if not @hasBeenOpened
            el = $('broen-gallery-swipe-carousel')
            require ["dr-widget-swipe-carousel"], (Swipe) =>
                @swipe = new Swipe el,
                    startSlide: index

                window.fireEvent 'dr-dom-inserted', [$$('span.image-wrap')]
                window.fireEvent 'dr-dom-inserted', [$$('div.dr-widget-video-player')]
        else
            @swipe.slide index

        @hasBeenOpened = true

    closeSlider: ->
        @slider.className = 'hide'
        if @isMobile then document.body.className = ''

    html: ->
        html = '<div>'

        for media in @media
            if media.type is 'image'
                html += """
                        #{DR.BroenGallery.getImg(media.url, 79, 79)}
                        """
            else if media.type is 'video'
                html += """
                        <span class="image-wrap dr-icon-play-boxed-small">
                            #{DR.BroenGallery.getImg(media.image, 79, 79)}
                        </span>
                        """

        return html + """</div><div id="broen-gallery-person-media-slider" class="hide"></div>"""


    getSliderHTML: ->
        html = """<div class="section boxed">
                     <h3>#{@name} - billeder/video<a href="#" class="dr-link-readmore dr-icon-close">Luk</a></h3>
                     <div id="broen-gallery-swipe-carousel" class="dr-widget-swipe-carousel" data-min-item-span="8">"""

        for media in @media
            if media.type is 'image'
                html += """
                        <div class="carousel-item">
                            <div class="item">
                                <span role="presentation" aria-hidden="true" class="image-wrap ratio-16-9">
                                    <noscript data-src="#{media.url}" data-width="0" data-height="0">
                                        <img src="#{media.url}" alt="" width="0" height="0" role="presentation" aria-hidden="true" />
                                    </noscript>
                                </span>
                            </div>
                        </div>
                        """
            else if media.type is 'video'
                html += """
                        <div class="carousel-item video">
                            <div class="item">
                                <div class="dr-widget-video-player ratio-16-9" data-resource="http://www.dr.dk/handlers/GetResource.ashx?id=#{media.resourceId}" data-image="#{media.image}"></div>
                            </div>
                        </div>
                        """

        return html + "</div></div>"