from worker import create_app
import os

if __name__ == "__main__":
    app = create_app()

    @app.route('/')
    def hello():
        return "Hello, World!"

    port = int(os.getenv("PORT", 5001))
    app.run(debug=True, host="0.0.0.0", port=port)