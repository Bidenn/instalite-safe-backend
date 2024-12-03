pipeline {
    agent any

    environment {
        scannerHome = tool 'jenkins-backend-safe-tool' // Configure the SonarQube scanner tool in Jenkins
    }

    stages {
        stage('SCM Checkout') {
            steps {
                // Clone the specified GitHub repository
                git branch: 'main', url: 'https://github.com/Bidenn/instalite-safe-backend.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Run SonarQube scanner
                withSonarQubeEnv('SonarQube Server') { // Ensure the correct SonarQube server name is configured
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        stage("Quality Gate") {
            steps {
                // Wait for the SonarQube Quality Gate
                timeout(time: 30, unit: 'MINUTES') {
                    script {
                        try {
                            waitForQualityGate abortPipeline: true
                        } catch (Exception e) {
                            echo 'Quality Gate failed, but continuing the pipeline...'
                        }
                    }
                }
            }
        }

        stage('Remove Containers') {
            steps {
                // Bring down existing Docker containers
                sh 'docker-compose down || true'
            }
        }

        stage('Build and Start Containers') {
            steps {
                // Build and start containers
                sh 'docker-compose up --build -d'
            }
        }

        stage('ZAP Scan') {
            agent {
                docker {
                    image 'ghcr.io/zaproxy/zaproxy:stable' // Use the ZAP proxy Docker image
                    args '-u root --network host -v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:/zap/wrk:rw'
                }
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    // Perform ZAP baseline scan
                    sh 'zap-baseline.py -t http://localhost:5000 -r zapbaseline.html -x zapbaseline.xml'
                }
                // Copy and archive the ZAP scan results
                sh 'cp /zap/wrk/zapbaseline.html ./zapbaseline.html'
                sh 'cp /zap/wrk/zapbaseline.xml ./zapbaseline.xml'
                archiveArtifacts artifacts: 'zapbaseline.html'
                archiveArtifacts artifacts: 'zapbaseline.xml'
            }
        }
    }
}
