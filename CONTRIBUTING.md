# Contributing to Hospital Queue Management System

First off, thank you for considering contributing to the Hospital Queue Management System! It's people like you that make this project such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js v14 or higher
- MongoDB (Local or Atlas)
- Git
- npm or yarn

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/02AbhishekJP/hospital_queue_management.git
cd hospital-queue-management
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-owner/hospital-queue-management.git
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Before Submitting A Bug Report:**
- Check the issue list for similar issues
- Check if the issue has already been reported
- Collect information about the bug (browser, OS, etc.)

**How To Submit A (Good) Bug Report:**

Create an issue and provide the following information:

- **Use a clear, descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear, descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

## Development Setup

### 1. Environment Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 2. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the app at `http://localhost:5173`

## Making Changes

### Create a Branch

```bash
# Update your local master
git checkout main
git pull upstream main

# Create a new branch for your feature
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

### Make Your Changes

1. Make logical, atomic commits
2. Write clear commit messages
3. Reference issues when applicable
4. Keep changes focused on a single concern

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, etc.

**Scope:**
- `auth` - Authentication related
- `queue` - Queue management
- `analytics` - Analytics features
- `documents` - Document management
- `ui` - User interface
- `api` - API endpoints
- `db` - Database related

**Subject:**
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters

**Examples:**
```
feat(queue): add priority queue management
fix(auth): resolve jwt token expiration issue
docs(readme): update installation instructions
refactor(analytics): simplify data calculation
test(queue): add unit tests for queue logic
```

## Pull Request Process

### Before Submitting

1. **Update your branch:**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests and linting:**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run build
```

3. **Test your changes** thoroughly

### Submitting Your PR

1. Push your branch:
```bash
git push origin feature/your-feature-name
```

2. Create a Pull Request on GitHub with:
   - Clear, descriptive title
   - Reference to related issues (#123)
   - Description of changes
   - Screenshots/GIFs if UI changes

3. PR Template:
```
## Description
Brief description of your changes.

## Related Issues
Fixes #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2

## Testing
Describe how you tested these changes:
- [ ] Test case 1
- [ ] Test case 2

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have tested the changes locally
- [ ] I have updated documentation
- [ ] No new warnings have been generated
```

### Review Process

- At least one maintainer will review your PR
- Changes may be requested
- Once approved, your PR will be merged

## Coding Standards

### JavaScript/Node.js

```javascript
// ✅ DO
const getUserData = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ DON'T
function getUserData(id){
var user = User.findById(id);
return user;
}
```

### React

```javascript
// ✅ DO
const QueueComponent = ({ queueData, onUpdate }) => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    setPosition(queueData.position);
  }, [queueData]);
  
  return (
    <div className="queue-container">
      <h1>Queue Position: {position}</h1>
    </div>
  );
};

// ❌ DON'T
const QueueComponent = (props) => {
  // Too much logic, no hooks usage
  return <div>...</div>;
};
```

### General Guidelines

- Use meaningful variable names
- Write comments for complex logic
- Keep functions small and focused (single responsibility)
- Use const/let instead of var
- Add proper error handling
- Use template literals for strings
- Follow DRY principle

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Writing Tests

- Write tests for new features
- Aim for 80%+ code coverage
- Use descriptive test names
- Test both success and error cases

## Reporting Bugs

### Before Submitting

- Check existing issues
- Verify the bug still exists

### Bug Report Includes:
- Clear title and description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment (OS, browser, Node version)

## Style Guide

### Code Style

- 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- `camelCase` for variables and functions
- `PascalCase` for classes and components
- `UPPER_CASE` for constants

### Comments

```javascript
// Single line comment for explanations

/*
 * Multi-line comments for
 * complex logic explanations
 */

// TODO: Future improvement needed here
// FIXME: This needs to be fixed
```

## Performance Considerations

- Minimize API calls
- Use debouncing/throttling for frequent events
- Optimize database queries with proper indexing
- Lazy load components when possible
- Profile before optimizing

## Documentation

- Update README.md if adding new features
- Keep API documentation up to date
- Add inline comments for complex logic
- Update CHANGELOG if applicable

## Community

- Join discussions on GitHub Issues
- Ask questions respectfully
- Help review other pull requests
- Share ideas for improvements

## Questions?

Feel free to open an issue with the `question` label, and the maintainers will help!

---

Thank you for contributing! ❤️

Your contributions, no matter how small, are greatly appreciated!
