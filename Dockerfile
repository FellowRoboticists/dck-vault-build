FROM debian:stretch-slim

USER root

RUN \
        DEBIAN_FRONTEND=noninteractive \
        && apt-get -y -q update \
        && apt-get -y -q install curl git bzip2 gnupg sqlite3 \
        && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
        && apt-get -y -q install nodejs \
	&& npm install -g npm@latest \
	&& npm install -g yarn \
	&& npm install -g @angular/cli \
	&& useradd --comment "Deploy prep user" --create-home --system --shell /bin/bash packager \
	&& mkdir -p /var/lib/vault-deploy \
	&& mkdir -p /var/www/vault-deploy-api \
	&& chown packager:root /var/lib/vault-deploy \
	&& chmod 755 /var/lib/vault-deploy \
	&& su -c "ssh-keygen -f /home/packager/.ssh/id_rsa -t rsa -b 4096 -C naiveroboticist@gmail.com -N ''" packager \
	&& cat /home/packager/.ssh/id_rsa.pub

COPY bin/*.sh /usr/local/bin/
COPY vault-deploy-api /var/www/vault-deploy-api/
COPY services/vault-deploy.service /etc/systemd/system/

RUN \
	(cd /var/www/vault-deploy-api && yarn install --production)

EXPOSE 3000/tcp

VOLUME [ "/var/lib/vault-deploy" ]

WORKDIR /var/www/vault-deploy-api

USER packager

ENTRYPOINT [ "bin/www" ]
