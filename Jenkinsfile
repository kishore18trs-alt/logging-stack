pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo "Cloning repo..."
                git branch: 'main', url: 'https://github.com/kishore18trs-alt/logging-stack.git'
            }
        }

        stage('Build') {
            steps {
                echo "Starting logging stack..."
                sh 'docker-compose up -d'
            }
        }

        stage('Test') {
            steps {
                echo "Checking containers..."
                sh 'docker ps'
            }
        }

        stage('Deploy') {
            steps {
                echo "Logging stack deployed successfully 🚀"
            }
        }
    }

    post {
        success {
            echo "SUCCESS ✅"
        }
        failure {
            echo "FAILED ❌"
        }
    }
}