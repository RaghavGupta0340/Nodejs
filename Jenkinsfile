
pipeline {
agent any
triggers { pollSCM('H/2 * * * *') }
stages {
stage('Build') { steps { sh 'sh app.js' } }
stage('Test')  { steps { sh 'sh test.js' } }
stage('Deploy') { steps { echo 'Deploying...' } }
}
}
