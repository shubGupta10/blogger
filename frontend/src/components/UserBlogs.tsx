import { useQuery } from '@apollo/client';
import { GET_BLOGS_BY_USER } from '@/Graphql/queries/blogQueries';

interface Blog {
    _id: string;
    title: string;
    blogImage: string;
    blogContent: string;
    createdAt: string;
}

const UserBlogs = () => {


    const { data, loading, error } = useQuery(GET_BLOGS_BY_USER);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading blogs: {error.message}</p>;

    const blogs = data?.blogsByUser || [];

    return (
        <div>
            <h1>My Blogs</h1>
            {blogs.map((blog: Blog) => (
                <div key={blog._id}>
                    <h2>{blog.title}</h2>
                    <img src={blog.blogImage} alt={blog.title} />
                    <p>{blog.blogContent.substring(0, 100)}...</p>
                    <p>Created at: {new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default UserBlogs;
