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
        console.log "init slider"+this        
        @slider = document.getElementById 'broen-gallery-person-media-slider'
        @slider.innerHTML = this.getSliderHTML()


    openSlider: (index) ->
        console.log "open slider index: "+index
        ###
        @slider.className = ''
        if @isMobile then document.body.className = 'broen'
        ###
        if not @hasBeenOpened
            new NivooSlider($("Slider"),
              directionNavPosition: "outside"
              effect: "random"
              interval: 5000
              orientation: "random"
            )       
        else
            #@swipe.slide index

        @el = document.getElementById 'broen-gallery-person-media-slider'
        @el.className = ''


        @hasBeenOpened = true
        

    closeSlider: ->
        console.log "close slider"+this
        @slider.className = 'hide'
        if @isMobile then document.body.className = ''


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
        html = """<div id='Slider' class='nivoo-slider'>
                     <h3>#{@name} - Fotos/Videos<a href="#" class="dr-link-readmore dr-icon-close">Schließen</a></h3>
                     <div class="swipe-wrap">"""

        for media in @media
            if media.type is 'image'
                html += """
                        <div class='image'>
                                <img src="#{media.image}" alt="" width="0" height="0" role="presentation" aria-hidden="true2" />
                        </div>
                        """
            else if media.type is 'video'
                html += """
                        <div class="video">
                                <img src="#{media.image}" alt="" width="0" height="0" role="presentation" aria-hidden="true2" />
                        </div>
                        """

        return html + "</div></div>"