pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo "Cloning repo..."
                git 'https://github.com/kishore18trs-alt/logging-stack.git'
            }
        }

        stage('Build') {
            steps {
                echo "Starting Docker services..."
                sh 'docker-compose up -d'
            }
        }

        stage('Test') {
            steps {
                echo "Checking running containers..."
                sh 'docker ps'
            }
        }

        stage('Deploy') {
            steps {
                echo "Logging stack deployed!"
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