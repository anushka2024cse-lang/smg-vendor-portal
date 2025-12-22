# Development Workflow

Best practices and guidelines for developing SMG Vendor Portal.

---

## Git Workflow

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- `develop` - Development branch
- `staging` - Pre-production testing

**Feature Branches:**
```bash
# Create feature branch
git checkout -b feature/notification-system

# Name format:
# feature/feature-name
# bugfix/bug-description
# hotfix/critical-fix
```

### Commit Messages

**Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
feat(notifications): add email notification system

fix(sor): resolve form validation issue

docs(api): update API reference for new endpoints

refactor(components): extract NotificationCenter logic
```

### Pull Request Process

1. **Create PR:**
   - Descriptive title
   - Link to issue/ticket
   - List changes
   - Add screenshots if UI

2. **Code Review:**
   - At least 1 approval required
   - Address review comments
   - Keep PR focused

3. **Merge:**
   - Squash commits if many small commits
   - Update changelog
   - Delete branch after merge

---

## Code Standards

### JavaScript/React

**File Structure:**
```javascript
// 1. Imports (external first, then internal)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ComponentName from '../components/ComponentName';
import { useToast } from '../contexts/ToastContext';

// 2. Component
const MyComponent = () => {
    // Hooks
    const navigate = useNavigate();
    const toast = useToast();
    
    // State
    const [data, setData] = useState([]);
    
    // Handlers
    const handleSubmit = async () => {
        // Logic
    };
    
    // Render
    return (
        <div>Content</div>
    );
};

// 3. Export
export default MyComponent;
```

**Naming Conventions:**
- Components: PascalCase (`NotificationCenter`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)
- CSS classes: kebab-case or Tailwind

**Best Practices:**
- Keep components under 300 lines
- Extract logic to custom hooks
- Use PropTypes or TypeScript
- Comment complex logic
- Handle errors gracefully

### Backend

**Controller Pattern:**
```javascript
// @desc    Description
// @route   HTTP_METHOD /path
// @access  Public/Private
exports.functionName = async (req, res) => {
    try {
        // Validation
        if (!req.body.required) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field'
            });
        }
        
        // Logic
        const result = await Model.create(req.body);
        
        // Response
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
```

**API Response Format:**
```javascript
// Success
{
    success: true,
    data: {...},
    message: "Optional message"
}

// Error
{
    success: false,
    error: "Error message"
}
```

---

## Testing Strategy

### Manual Testing Checklist

Before committing:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation)
- [ ] Error states handled
- [ ] Loading states shown

### API Testing

**Using Thunder Client/Postman:**
```javascript
// Test GET
GET http://localhost:5000/api/v1/notifications

// Test POST
POST http://localhost:5000/api/v1/notifications
Content-Type: application/json

{
    "recipient": "temp-user-id",
    "type": "info",
    "title": "Test",
    "message": "Test message"
}
```

### Unit Testing (Future)

```javascript
// Example test
describe('NotificationService', () => {
    it('should create notification', async () => {
        const data = {
            title: 'Test',
            message: 'Test message'
        };
        const result = await notificationService.create(data);
        expect(result.success).toBe(true);
    });
});
```

---

## Code Review Guidelines

### As Reviewer

**Check for:**
- Code follows standards
- No security vulnerabilities
- Proper error handling
- Tests included (when applicable)
- Documentation updated
- No console.logs in production

**Review Comments:**
- Be constructive
- Explain reasoning
- Suggest improvements
- Approve when ready

### As Author

**Before requesting review:**
- Self-review your code
- Test thoroughly
- Update documentation
- Write clear PR description
- Respond to comments promptly

---

## Development Environment

### VS Code Extensions

**Required:**
- ESLint
- Prettier

**Recommended:**
- Tailwind CSS IntelliSense
- ES7+ React snippets
- GitLens
- Thunder Client
- MongoDB for VS Code

### Settings

```json
// .vscode/settings.json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "tailwindCSS.emmetCompletions": true
}
```

---

## Performance Best Practices

### Frontend

**1. Code Splitting:**
```javascript
// Lazy load routes
const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'));

<Suspense fallback={<Loading />}>
    <AdminPanel />
</Suspense>
```

**2. Memoization:**
```javascript
// Expensive calculations
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);

// Prevent re-renders
const MemoizedComponent = React.memo(ExpensiveComponent);
```

**3. Optimize Images:**
- Use WebP format
- Lazy load images
- Optimize size/quality

### Backend

**1. Database Queries:**
```javascript
// Use lean() for read-only
const data = await Model.find().lean();

// Use select() to limit fields
const data = await Model.find().select('name email');

// Add indexes
schema.index({ field: 1 });
```

**2. Caching (Future):**
```javascript
// Redis caching
const cachedData = await redis.get(key);
if (cachedData) return JSON.parse(cachedData);
```

---

## Security Best Practices

### Input Validation

```javascript
// Backend validation
const { body, validationResult } = require('express-validator');

router.post('/notifications',
    [
        body('title').trim().notEmpty(),
        body('message').trim().notEmpty(),
        body('type').isIn(['info', 'success', 'warning', 'error'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Process
    }
);
```

### Environment Variables

- Never commit `.env` files
- Use strong secrets
- Rotate keys regularly
- Different keys per environment

### Authentication

```javascript
// Protect routes
router.get('/admin', protect, adminController.getStats);

// Sanitize input
const sanitized = req.body.input.trim().toLowerCase();
```

---

## Documentation

### Code Comments

**When to comment:**
- Complex algorithms
- Business logic
- Non-obvious decisions
- TODO/FIXME items

**Example:**
```javascript
// Calculate total with 18% GST
// Formula: base + (base * 0.18)
const total = baseAmount * 1.18;

// TODO: Add validation for negative amounts
// FIXME: Handle decimal precision correctly
```

### README Updates

Update README when:
- Adding new features
- Changing setup process
- Adding dependencies
- Modifying environment variables

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build succeeds
- [ ] Documentation updated

### Post-Deployment

- [ ] Verify deployment
- [ ] Test critical paths
- [ ] Monitor error logs
- [ ] Check performance metrics

---

## Daily Workflow

```bash
# Morning
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# During development
# Make changes
git add .
git commit -m "feat(scope): description"

# Before lunch/EOD
git push origin feature/my-feature

# End of feature
# Create PR
# Address reviews
# Merge to develop
```

---

## Communication

### Stand-ups

Daily updates:
- What I did yesterday
- What I'm doing today
- Any blockers

### Documentation

Keep updated:
- API changes → API_REFERENCE.md
- New features → Feature docs
- Bug fixes → CHANGELOG.md
- Setup changes → ENVIRONMENT_SETUP.md

---

## Tools & Resources

**Development:**
- Chrome DevTools
- React Developer Tools
- MongoDB Compass
- Postman/Thunder Client

**Collaboration:**
- GitHub/GitLab
- Slack/Teams
- Jira/Linear

**Learning:**
- React docs
- Express docs
- MongoDB docs
- Tailwind docs

---

## Tips for Success

1. **Write clean code first, optimize later**
2. **Test early and often**
3. **Document as you go**
4. **Ask questions when stuck**
5. **Review others' code to learn**
6. **Keep PRs small and focused**
7. **Commit frequently with clear messages**
8. **Stay updated with dependencies**

---

Need help? Check [Common Issues](./COMMON_ISSUES.md) or ask the team!
