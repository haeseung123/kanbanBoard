pipeline {
    agent any
    
    environment {
        IMAGE_NAME = "haeseung/kanban-server"
        VERSION_TAG = "v1.0.${currentBuild.number}"
    }

    stages {
        stage('git clone') {
            steps {
                git branch: 'develop', changelog: false, credentialsId: 'GitHub-Token', url: 
                "https://github.com/haeseung123/kanbanBoard.git"
            }
        }
        stage('Docker Image Build') {
            steps {
                script {
                    sh "/usr/local/bin/docker-compose --env-file .development.env build"
                }
            }
        }
        stage('Docker Image Push') {
            steps {
                script {
                    sh "docker tag ${IMAGE_NAME} ${IMAGE_NAME}:${VERSION_TAG}"
                            
                    withDockerRegistry(credentialsId: 'DockerHub-Token') {
                        sh "docker push ${IMAGE_NAME}:${VERSION_TAG}"
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
        stage('K8S Manifest Update'){
            steps {
                script {
                    def repoPath = "k8s_cicd_prac"
                    
                    // 기존 디렉토리 삭제
                    if (fileExists(repoPath)) {
                    sh "rm -rf ${repoPath}"
                    }
                            
                    sh "mkdir ${repoPath}"
                    
                    dir(repoPath) {
                        git branch: 'main', changelog: false, credentialsId: 'GitHub-Token', poll: false, url: 'https://github.com/haeseung123/k8s_cicd_prac.git'
                                
                        // deployment-patches.yaml 파일에서 이미지 태그를 최신 빌드 태그로 변경
                        sh "sed -i 's|haeseung/kanban-server:.*|haeseung/kanban-server:${VERSION_TAG}|g' overlays/development/deployment-patches.yaml"
                                
                        // kustomize.yaml에서 이미지 태그를 동적으로 업데이트
                        sh "sed -i 's|newTag: .*|newTag: ${VERSION_TAG}|g' overlays/development/kustomization.yaml"
                    
                        sh 'git add overlays/development/.'
                        sh "git -c user.name='haeseung123' -c user.email='showui96@gmail.com' commit -m 'update image tag to ${VERSION_TAG}'"
                                
                        withCredentials([gitUsernamePassword(credentialsId: 'GitHub-Token', gitToolName: 'git-tool')]) {
                        sh "git remote set-url origin https://github.com/haeseung123/k8s_cicd_prac.git"
                        sh "git push -u origin main"
                        }            
                    }
                }
            }
        }
    }
}