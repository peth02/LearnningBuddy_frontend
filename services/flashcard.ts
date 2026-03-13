import { getToken } from "@/lib/session";
import {
  DeckMetaData,
  Flashcard,
  Question,
  QuizMetaData,
} from "@/types/Course";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export async function getDecksByCourseId(course_id: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/${course_id}/decks`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Fail to get decks");
    }
    // console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getDecksByCourseId:", error.message);
    throw error;
  }
}
export async function getDeckByDeckId(deck_id: any) {
  // get deck detail for edit
  const token = await getToken();
  const url = `${baseURL}/decks/${deck_id}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fail to get deck ${deck_id}`);
    }
    // console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getDeckByDeckId:", error.message);
    throw error;
  }
}
export async function createFlashcardPreview(deckConfigs: any, course_id: any) {
  const token = await getToken();
  const url = `${baseURL}/decks/preview/jobs`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: course_id,
        deck_topics: deckConfigs,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fail to create preview flashcards`);
    }
    // console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in createFlashcardPreview:", error.message);
    throw error;
  }
}

export async function updateCourseDeckById(deck_id: any, cards: Flashcard[]) {
  const token = await getToken();
  const url = `${baseURL}/decks/${deck_id}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cards: cards,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.details || `Fail to update deck ${deck_id}`,
      };
    }
    // console.log(res);
    return {
      success: true,
      message: "Update deck successfully!",
      data: data,
    };
  } catch (error: any) {
    console.error("Error in updateCourseDeckById:", error.message);
    return {
      success: false,
      message: "Could not connect to the server.",
    };
  }
}

export async function getFlashcardPreviewByJobId(job_id: any) {
  const token = await getToken();
  const url = `${baseURL}/decks/preview/jobs/${job_id}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Fail to get deck by job id");
    }
    // console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getFlashcardPreviewByJobId:", error.message);
    throw error;
  }
}

export async function createFlashcardFromPreview(
  course_id: any,
  deckMetaData: DeckMetaData,
  cards: Flashcard[],
) {
  const url = `${baseURL}/courses/${course_id}/decks`;
  const token = await getToken();
  try {
    // create form data
    if (deckMetaData && cards) {
      const sendData = {
        title: deckMetaData.title,
        is_published: deckMetaData.is_published,
        cards: cards,
      };
      if (!token) {
        console.warn("Login is required");
        return [];
      }
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: data.details || "Fail to create deck",
        };
      }
      return {
        success: true,
        message: "Create deck successfully!",
        data: data,
      };
    }
  } catch (error: any) {
    console.error("Error in createFlashcardFromPreview:", error.message);
    return {
      success: false,
      message: "Could not connect to the server.",
    };
  }
}
