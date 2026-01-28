IMAGE_NAME = deploy-on-qarnot
PORT = 3000

.PHONY: build serve stop clean

build:
	docker build -t $(IMAGE_NAME) .

serve:
	docker run -d --name $(IMAGE_NAME) -p $(PORT):3000 $(IMAGE_NAME)
	@echo "Server running at http://localhost:$(PORT)"

stop:
	docker stop $(IMAGE_NAME) && docker rm $(IMAGE_NAME)

open:
	xdg-open http://localhost:$(PORT) || open http://localhost:$(PORT)

clean: stop
	docker rmi $(IMAGE_NAME)
