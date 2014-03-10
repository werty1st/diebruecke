class MooRouter
    constructor: (app) ->
        @app = app

        router = Router.implement
            routes:
                ''       : 'homeRoute'
                '#0'      : 'reload'
                '#1'      : 'reload'
                '#2'      : 'reload'
                '#3'      : 'reload'
                '#4'      : 'reload'
                '#5'      : 'reload'
                '#:slug' : 'personRoute'

            reload: =>
                window.location.reload()

            homeRoute: =>
                @app.showHome()

            personRoute: ->
                this.showPerson this.param.slug

            showPerson: (slug) =>
                if slug is 'home'
                    return @app.showHome()

                if @app.isMobile
                    offset = @app.container.offsetTop - 10
                    window.scrollTo 0, offset

                if @app.data[slug]
                    @app.showPerson slug
                else                    
                    alert 'Mangler data for ' + slug + '.'

        return new router