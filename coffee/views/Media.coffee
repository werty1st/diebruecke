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

            if ((target.tagName.toLowerCase()) is 'img' and (target.className != "video"))
                this.initSlider() unless @hasBeenOpened
            

                target = $(target)
                if target.getParent().hasClass 'image-wrap'
                    target = target.getParent()

                index = target.getParent().getChildren().indexOf(target) 
                this.openSlider(index)

                if e.preventDefault then e.preventDefault() else e.returnValue = false
            else if target.className is 'dr-link-readmore dr-icon-close'
                if e.preventDefault then e.preventDefault() else e.returnValue = false

                this.closeSlider()
            else
                false

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
            document.getElementById("myvideo").className = ""
            @swipe.slide index

        @hasBeenOpened = true

    closeSlider: ->
        @slider.className = 'hide'
        if @isMobile then document.body.className = ''

        if player
            player.stop()
            document.getElementById("myvideo").className = "hide"

    html: ->
        html = '<div>'

        for media in @media
            if media.type is 'image'
                html += """
                        #{DR.BroenGallery.getImg(media.thumbnail, 79, 79)}
                        """
            else if media.type is 'video'
                html += """
                        <span class="image-wrap dr-icon-play-boxed-small">
                            #{DR.BroenGallery.getImg(media.thumbnail, 79, 79)}
                        </span>
                        """

        return html + """</div><div id="broen-gallery-person-media-slider" class="hide"></div>"""


    getSliderHTML: ->
        html = """<div class="section boxed">
                     <h3>#{@name} - Fotos/Videos<a href="#" class="dr-link-readmore dr-icon-close">Schließen</a></h3>
                     <div id="broen-gallery-swipe-carousel" class="dr-widget-swipe-carousel" data-min-item-span="8">"""

        i1=0
        for media in @media
            i1++
            if media.type is 'image'
                html += """
                        <div class="carousel-item">
                            <div class="item" >
                                <span role="presentation" aria-hidden="true" class="image-wrap ratio-16-9">
                                    <img src="#{media.image}" alt="" width="0" height="0" role="presentation" aria-hidden="true" />                                    
                                </span>
                            </div>
                        </div>
                        """
            else if media.type is 'video'
                html += """
                        <div class="carousel-item">
                            <div class="item" >
                                <span role="presentation" aria-hidden="true" class="image-wrap ratio-16-9">
                                        <div class="icon-film play-overlay" >
                                        </div>
                                        <div class="play-base" >
                                            <img src="#{media.image}" id="video#{i1}" class="video" onclick="playvideo(this);return false;" alt="" width="0" height="0" role="presentation" aria-hidden="true" video-url="#{media.video}" /> 
                                        </div>
                                </span>
                            </div>
                        </div>
                        """

        return html + "</div></div>"

#todo video playbutton overlay+function to laod player        