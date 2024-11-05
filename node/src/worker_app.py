from worker import create_app

if __name__ == "__main__":
    app = create_app()

    @app.route('/')
    def hello():
        return "Hello, World!"

    app.run(debug=True, host="0.0.0.0", port=5001)