import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sahi-nutrition';

// Define schemas locally for the seed script to avoid import issues with Astro/TS
const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  featuredImage: String,
  category: String,
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
  blogId: String,
  name: String,
  email: String,
  content: String,
  ipAddress: String,
  os: String,
  screenSize: String,
  location: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

const generateContent = () => {
  let content = '';
  // Generate ~2000 words. A typical paragraph has ~50 words, so we need ~40 paragraphs.
  for (let i = 0; i < 40; i++) {
    content += `<p>${faker.lorem.paragraph(5)}</p>`;
    if (i % 5 === 0 && i !== 0) {
      content += `<h2>${faker.lorem.sentence()}</h2>`;
    }
  }
  return content;
};

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    console.log('Clearing existing data...');
    await Blog.deleteMany({});
    await Comment.deleteMany({});

    console.log('Generating dummy blogs...');
    const blogs = [];
    for (let i = 0; i < 15; i++) {
      const title = faker.lorem.sentence();
      const blog = new Blog({
        title: title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        excerpt: faker.lorem.paragraph(2),
        content: generateContent(),
        featuredImage: `https://picsum.photos/seed/${faker.string.uuid()}/1200/600`,
        category: faker.helpers.arrayElement(['Nutrition', 'Fitness', 'Wellness', 'Lifestyle', 'Recipes']),
      });
      await blog.save();
      blogs.push(blog);
      console.log(`Created blog: ${blog.title}`);
    }

    console.log('Generating dummy comments...');
    for (const blog of blogs) {
      const numComments = faker.number.int({ min: 1, max: 5 });
      for (let j = 0; j < numComments; j++) {
        const comment = new Comment({
          blogId: blog._id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          content: faker.lorem.sentence(), // One liner comment
          ipAddress: faker.internet.ipv4(),
          os: faker.helpers.arrayElement(['Windows 10', 'macOS', 'iOS', 'Android', 'Linux']),
          screenSize: faker.helpers.arrayElement(['1920x1080', '1366x768', '390x844', '412x915']),
          location: {
            lat: faker.location.latitude(),
            lng: faker.location.longitude()
          }
        });
        await comment.save();
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
