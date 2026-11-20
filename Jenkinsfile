pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'node app.js'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
