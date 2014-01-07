class PersonInfoView

    constructor: (app, container) ->
        @app = app
        @container = container
        this.addEvents()

    addEvents: ->
        bindEvent @container, 'click', (e) =>
            target = if e.target then e.target else window.event.srcElement
            
            if target.className is 'vote-btn'
                if e.preventDefault then e.preventDefault() else e.returnValue = false
                @app.vote @person.slug

    show: (person) ->
        @person = person
        @container.innerHTML = this.html person
        p = document.getElementById 'broen-gallery-person-text'
        window.fireEvent 'dr-dom-inserted', [$$('p')]

        if person.media and person.media.length > 0
            inner = document.getElementById 'broen-gallery-person-info-inner'
            inner.appendChild new MediaView person.name, person.media, @app.isMobile

    html: (person) ->
        html =  """
                <div id="broen-gallery-person-info-inner">
                    #{DR.BroenGallery.getFaceImg(person.image, 50)}
                    <h2>#{person.name}</h2>
                    <p id="broen-gallery-person-text" data-maxlines="5" data-readmore="true" >#{person.longText}</p>
                """

        if DR.BroenGallery.config.votingEnabled
            html += """<div class="vote">Tror du #{person.name} er involveret i forbrydelserne?<br /><button class="vote-btn">ja!</button></div>"""

        return html + "</div>"