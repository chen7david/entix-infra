FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Install AWS CLI v2 (auto-detects architecture for ARM64 and x86-64)
# See: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
RUN apt-get update && \
    apt-get install -y unzip curl groff less && \
    ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then ARCH_NAME="x86_64"; elif [ "$ARCH" = "aarch64" ]; then ARCH_NAME="aarch64"; else echo "Unsupported architecture: $ARCH" && exit 1; fi && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-$ARCH_NAME.zip" -o "/tmp/awscliv2.zip" && \
    unzip /tmp/awscliv2.zip -d /tmp && \
    /tmp/aws/install && \
    rm -rf /tmp/aws /tmp/awscliv2.zip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install TypeScript, AWS CDK, and other useful global Node.js tools for AWS development
RUN su node -c "npm install -g typescript aws-cdk@latest ts-node@latest eslint prettier @types/node"


# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
