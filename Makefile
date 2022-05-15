VOTER_IMG=voter
BALLOT_IMG=ballot
ECSVR_IMG=ecserver
TEST_IMG=service-test-suite
EC_IMG=election-commission
ifndef IMAGE_TAG
  IMAGE_TAG=latest
endif
CLUSTER_IP := $(shell ping -W2 -n -q -c1 current-cluster-roost.io  2> /dev/null | awk -F '[()]' '/PING/ { print $$2}')

# HOSTNAME := $(shell hostname)
.PHONY: all
all: dockerise helm-deploy

.PHONY: dockerise
dockerise: build-voter build-ballot build-ecserver build-ec build-test

.PHONY: build-test
build-test:
ifdef DOCKER_HOST
	docker -H ${DOCKER_HOST} build -t ${TEST_IMG}:${IMAGE_TAG} -f service-test-suite/Dockerfile service-test-suite
else
	docker build -t ${TEST_IMG}:${IMAGE_TAG} -f service-test-suite/Dockerfile service-test-suite
endif

.PHONY: build-ec
build-ec:
ifdef DOCKER_HOST
	docker -H ${DOCKER_HOST} build -t ${EC_IMG}:${IMAGE_TAG} -f election-commission/Dockerfile election-commission
else
	docker build -t ${EC_IMG}:${IMAGE_TAG} -f election-commission/Dockerfile election-commission
endif
		
.PHONY: push
push:
	docker tag ${EC_IMG}:${IMAGE_TAG} zbio/${EC_IMG}:${IMAGE_TAG}
	docker push zbio/${EC_IMG}:${IMAGE_TAG}
	docker tag ${TEST_IMG}:${IMAGE_TAG} zbio/${TEST_IMG}:${IMAGE_TAG}
	docker push zbio/${TEST_IMG}:${IMAGE_TAG}

.PHONY: deploy
deploy:
	kubectl apply -f service-test-suite/test-suite.yaml
	kubectl apply -f election-commission/ec.yaml
	kubectl apply -f ingress.yaml
	
.PHONY: helm-deploy
helm-deploy: 
ifeq ($(strip $(CLUSTER_IP)),)
	@echo "UNKNOWN_CLUSTER_IP: failed to resolve current-cluster-roost.io to an valid IP"
	@exit 1;
endif
		helm install vote helm-vote --set clusterIP=$(CLUSTER_IP)
		
.PHONY: helm-undeploy
helm-undeploy:
		-helm uninstall vote

.PHONY: clean
clean: helm-undeploy
	-kubectl delete -f service-test-suite/test-suite.yaml
	-kubectl delete -f election-commission/ec.yaml
