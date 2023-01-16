VERSION_FROM_PACKAGE_JSON=$(cat package.json|grep version|head -1|awk -F: '{ print $2 }'|sed 's/[", ]//g')
docker build -f deploy/front/nginx-Dockerfile -t budget-nginx:$VERSION_FROM_PACKAGE_JSON .
