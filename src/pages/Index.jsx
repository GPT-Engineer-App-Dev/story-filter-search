import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
  return stories;
};

function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-center mb-4">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-10 mb-4" count={10} />
      ) : error ? (
        <div>Error loading stories</div>
      ) : (
        filteredStories.map((story) => (
          <Card key={story.id} className="mb-4">
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
}

export default Index;