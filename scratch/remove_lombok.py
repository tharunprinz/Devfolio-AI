import os
import re

files_to_process = [
    "backend/src/main/java/com/devportfolio/controller/ProjectController.java",
    "backend/src/main/java/com/devportfolio/controller/ResumeController.java",
    "backend/src/main/java/com/devportfolio/controller/PortfolioController.java",
    "backend/src/main/java/com/devportfolio/controller/AuthController.java",
    "backend/src/main/java/com/devportfolio/controller/GitHubController.java",
    "backend/src/main/java/com/devportfolio/service/UserService.java",
    "backend/src/main/java/com/devportfolio/service/AIService.java",
    "backend/src/main/java/com/devportfolio/controller/PublicPortfolioController.java",
    "backend/src/main/java/com/devportfolio/service/GitHubService.java",
    "backend/src/main/java/com/devportfolio/controller/AIController.java",
    "backend/src/main/java/com/devportfolio/security/AuthTokenFilter.java",
    "backend/src/main/java/com/devportfolio/security/AuthEntryPointJwt.java",
    "backend/src/main/java/com/devportfolio/security/JwtUtils.java"
]

for filepath in files_to_process:
    full_path = os.path.join("/Users/tharunr/projects/DevPortfolio-AI", filepath)
    if not os.path.exists(full_path):
        print(f"Skipping: {filepath} (does not exist)")
        continue
        
    print(f"Processing: {filepath}")
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Remove lombok slf4j import
    content = re.sub(r'import lombok\.extern\.slf4j\.Slf4j;\n?', '', content)
    
    # Extract class name to declare Logger correctly
    class_match = re.search(r'public (?:class|interface) (\w+)', content)
    if not class_match:
        print(f"  Cannot find class name in {filepath}")
        continue
        
    class_name = class_match.group(1)
    
    # Remove @Slf4j
    content = re.sub(r'@Slf4j\n?', '', content)
    
    # Insert static logger definition right after public class ClassName {
    logger_def = f'\n    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger({class_name}.class);\n'
    
    # We find "public class ClassName {" or "public class ClassName implements/extends"
    pattern = rf'(public (class|interface) {class_name}[^{{]*\{{)'
    content = re.sub(pattern, rf'\1{logger_def}', content)
    
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Refactoring completed successfully!")
