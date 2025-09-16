const swaggerDocument = {
  openapi: "3.1.0",
  info: {
    title: "VocAI API",
    version: "1.0.0",
    description:
      "VocAI 애플리케이션의 REST API를 문서화한 OpenAPI 명세입니다. 쿠키 기반 JWT 인증을 사용하는 보호된 엔드포인트를 포함합니다.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "로컬 개발 서버",
    },
  ],
  tags: [
    { name: "Auth", description: "사용자 인증 및 계정 관리" },
    { name: "Users", description: "사용자 프로필 및 개인화" },
    { name: "Persona", description: "면접 페르소나 관리" },
    { name: "Boards", description: "게시판 및 게시글" },
    { name: "Comments", description: "댓글 관리" },
    { name: "Attachments", description: "첨부파일 다운로드" },
    { name: "AI Interview", description: "AI 모의 면접 흐름" },
    { name: "TTS", description: "음성 합성" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description:
          "`/api/auth/signin`으로 발급되는 JWT 토큰. 대부분의 보호된 API는 이 쿠키가 필요합니다.",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "오류 메시지",
          },
        },
        required: ["error"],
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
        },
        required: ["success"],
      },
      AvailabilityResponse: {
        type: "object",
        properties: {
          available: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["available", "message"],
      },
      SignupRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
            minLength: 8,
          },
          name: {
            type: "string",
          },
          nickname: {
            type: "string",
          },
          phone: {
            type: "string",
            description: "하이픈이 제거된 전화번호 문자열",
          },
        },
        required: ["email", "password", "name", "nickname", "phone"],
      },
      SignupResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              nickname: { type: "string" },
            },
            required: ["email", "nickname"],
          },
        },
        required: ["message", "user"],
      },
      SigninRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
      SigninResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          token: {
            type: "string",
            description: "`token` 쿠키에도 저장되는 JWT 토큰",
          },
        },
        required: ["message", "token"],
      },
      Persona: {
        type: "object",
        properties: {
          company: {
            type: "array",
            items: { type: "string" },
          },
          job: {
            type: "array",
            items: { type: "string" },
          },
          careerLevel: { type: "string" },
          difficulty: {
            type: "string",
            enum: ["쉬움", "중간", "어려움"],
          },
          techStack: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "company",
          "job",
          "careerLevel",
          "difficulty",
          "techStack",
        ],
      },
      ProfileSummary: {
        type: "object",
        properties: {
          profileId: { type: "integer" },
          userId: { type: "integer" },
          nickName: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
        required: ["profileId", "userId", "nickName", "name", "email"],
      },
      ProfileDetail: {
        allOf: [
          { $ref: "#/components/schemas/ProfileSummary" },
          {
            type: "object",
            properties: {
              phoneNum: { type: "string" },
              persona: {
                oneOf: [
                  { $ref: "#/components/schemas/Persona" },
                  { type: "null" },
                ],
              },
            },
            required: ["phoneNum", "persona"],
          },
        ],
      },
      UserProfile: {
        type: "object",
        properties: {
          userId: { type: "integer" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
          profile: {
            type: "object",
            properties: {
              profileId: { type: "integer" },
              name: { type: "string" },
              nickName: { type: "string" },
              phoneNum: { type: "string" },
              persona: {
                oneOf: [
                  { $ref: "#/components/schemas/Persona" },
                  { type: "null" },
                ],
              },
            },
            required: ["profileId", "name", "nickName", "phoneNum", "persona"],
          },
        },
        required: ["userId", "email", "createdAt", "profile"],
      },
      UpdateProfileRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          nickName: { type: "string" },
          phone: { type: "string" },
          persona: {
            oneOf: [
              { $ref: "#/components/schemas/Persona" },
              { type: "null" },
            ],
          },
        },
        required: ["name", "nickName", "phone"],
      },
      CommentProfile: {
        allOf: [
          { $ref: "#/components/schemas/ProfileSummary" },
          {
            type: "object",
            properties: {
              phoneNum: { type: "string" },
              persona: {
                oneOf: [
                  { $ref: "#/components/schemas/Persona" },
                  { type: "null" },
                ],
              },
            },
          },
        ],
      },
      Comment: {
        type: "object",
        properties: {
          commentId: { type: "integer" },
          postId: { type: "integer" },
          profileId: { type: "integer" },
          nickName: { type: "string" },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          deletedAt: {
            oneOf: [{ type: "string", format: "date-time" }, { type: "null" }],
          },
          profile: { $ref: "#/components/schemas/CommentProfile" },
        },
        required: [
          "commentId",
          "postId",
          "profileId",
          "nickName",
          "content",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "profile",
        ],
      },
      CommentRequest: {
        type: "object",
        properties: {
          postId: { type: "integer" },
          content: { type: "string" },
        },
        required: ["postId", "content"],
      },
      CommentUpdateRequest: {
        type: "object",
        properties: {
          content: { type: "string" },
        },
        required: ["content"],
      },
      CommentDeleteResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          deletedCommentId: { type: "integer" },
        },
        required: ["success", "deletedCommentId"],
      },
      BoardStat: {
        type: "object",
        properties: {
          boardId: { type: "integer" },
          name: { type: "string" },
          postCount: { type: "integer" },
        },
        required: ["boardId", "name", "postCount"],
      },
      BoardStatsResponse: {
        type: "object",
        properties: {
          stats: {
            type: "array",
            items: { $ref: "#/components/schemas/BoardStat" },
          },
        },
        required: ["stats"],
      },
      AttachmentRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          size: { type: "integer" },
          type: { type: "string" },
          data: {
            type: "string",
            description: "Base64 인코딩된 파일 데이터",
          },
        },
        required: ["name", "size", "type", "data"],
      },
      AttachmentMetadata: {
        type: "object",
        properties: {
          attachmentId: { type: "string" },
          fileName: { type: "string" },
          fileSize: { type: "integer" },
          fileType: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: [
          "attachmentId",
          "fileName",
          "fileSize",
          "fileType",
          "createdAt",
        ],
      },
      Attachment: {
        allOf: [
          { $ref: "#/components/schemas/AttachmentMetadata" },
          {
            type: "object",
            properties: {
              fileData: {
                type: "string",
                description: "Base64 인코딩된 파일 데이터",
              },
              postId: { type: "integer" },
            },
            required: ["fileData", "postId"],
          },
        ],
      },
      BoardSummary: {
        type: "object",
        properties: {
          boardId: { type: "integer" },
          name: { type: "string" },
          isActive: { type: "boolean" },
        },
        required: ["boardId", "name", "isActive"],
      },
      BoardPost: {
        type: "object",
        properties: {
          postId: { type: "integer" },
          profileId: { type: "integer" },
          boardId: { type: "integer" },
          nickName: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          view: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          deletedAt: {
            oneOf: [{ type: "string", format: "date-time" }, { type: "null" }],
          },
          company: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          jobCategory: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          tags: {
            oneOf: [{ type: "string" }, { type: "null" }],
            description: "콤마로 구분된 태그 문자열",
          },
        },
        required: [
          "postId",
          "profileId",
          "boardId",
          "nickName",
          "title",
          "content",
          "view",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "company",
          "jobCategory",
          "tags",
        ],
      },
      BoardPostListItem: {
        allOf: [
          { $ref: "#/components/schemas/BoardPost" },
          {
            type: "object",
            properties: {
              profile: { $ref: "#/components/schemas/CommentProfile" },
              board: { $ref: "#/components/schemas/BoardSummary" },
              attachments: {
                type: "array",
                items: { $ref: "#/components/schemas/AttachmentMetadata" },
              },
              commentCount: { type: "integer" },
            },
            required: ["profile", "board", "attachments", "commentCount"],
          },
        ],
      },
      BoardPostDetail: {
        allOf: [
          { $ref: "#/components/schemas/BoardPost" },
          {
            type: "object",
            properties: {
              profile: { $ref: "#/components/schemas/CommentProfile" },
              board: { $ref: "#/components/schemas/BoardSummary" },
              attachments: {
                type: "array",
                items: { $ref: "#/components/schemas/Attachment" },
              },
              comments: {
                type: "array",
                items: { $ref: "#/components/schemas/Comment" },
              },
              commentCount: { type: "integer" },
            },
            required: [
              "profile",
              "board",
              "attachments",
              "comments",
              "commentCount",
            ],
          },
        ],
      },
      CreatePostRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          attachments: {
            type: "array",
            items: { $ref: "#/components/schemas/AttachmentRequest" },
          },
          company: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          jobCategory: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          tags: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["title", "content"],
      },
      CreatePostResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          post: { $ref: "#/components/schemas/BoardPost" },
          attachmentsCount: { type: "integer" },
          receivedData: {
            type: "object",
            properties: {
              titleLength: { type: "integer" },
              contentLength: { type: "integer" },
              boardId: { type: "integer" },
              hasAttachments: { type: "boolean" },
              attachmentNames: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "titleLength",
              "contentLength",
              "boardId",
              "hasAttachments",
              "attachmentNames",
            ],
          },
        },
        required: [
          "message",
          "post",
          "attachmentsCount",
          "receivedData",
        ],
      },
      UpdatePostRequest: {
        allOf: [
          { $ref: "#/components/schemas/CreatePostRequest" },
          {
            type: "object",
            properties: {
              deleteAttachmentIndexes: {
                type: "array",
                items: { type: "integer" },
              },
            },
          },
        ],
      },
      UpdatePostResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          post: { $ref: "#/components/schemas/BoardPost" },
          deletedCount: { type: "integer" },
          addedCount: { type: "integer" },
        },
        required: ["message", "post", "deletedCount", "addedCount"],
      },
      DeletePostResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          deletedPostId: { type: "integer" },
        },
        required: ["success", "deletedPostId"],
      },
      PostsResponse: {
        type: "object",
        properties: {
          posts: {
            type: "array",
            items: { $ref: "#/components/schemas/BoardPost" },
          },
        },
        required: ["posts"],
      },
      MockInterviewSession: {
        type: "object",
        properties: {
          sessionId: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          title: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
        },
        required: ["sessionId", "createdAt", "title"],
      },
      MockInterviewRecord: {
        type: "object",
        properties: {
          interviewId: { type: "integer" },
          sessionId: { type: "integer" },
          question: { type: "string" },
          answerText: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          summary: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          feedback: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          createdAt: { type: "string", format: "date-time" },
          deletedAt: {
            oneOf: [{ type: "string", format: "date-time" }, { type: "null" }],
          },
        },
        required: [
          "interviewId",
          "sessionId",
          "question",
          "answerText",
          "summary",
          "feedback",
          "createdAt",
          "deletedAt",
        ],
      },
      MockInterviewSessionDetail: {
        type: "object",
        properties: {
          records: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answerText: {
                  oneOf: [{ type: "string" }, { type: "null" }],
                },
                summary: {
                  oneOf: [{ type: "string" }, { type: "null" }],
                },
                feedback: {
                  oneOf: [{ type: "string" }, { type: "null" }],
                },
              },
              required: ["question", "answerText", "summary", "feedback"],
            },
          },
          ended: { type: "boolean" },
          summary: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
          feedback: {
            oneOf: [{ type: "string" }, { type: "null" }],
          },
        },
        required: ["records", "ended", "summary", "feedback"],
      },
      MockInterviewProgressResponse: {
        type: "object",
        properties: {
          question: { type: "string" },
          summary: { type: "string" },
          feedback: { type: "string" },
          record: { $ref: "#/components/schemas/MockInterviewRecord" },
        },
        required: ["question"],
        description:
          "`answerText`를 제공한 경우에는 summary/feedback/record가 포함되고, 없는 경우에는 다음 질문만 반환됩니다.",
      },
      MockInterviewQuestionResponse: {
        type: "object",
        properties: {
          question: { type: "string" },
          recordId: { type: "integer" },
        },
        required: ["question", "recordId"],
      },
      MockInterviewAnswerRequest: {
        type: "object",
        properties: {
          answerText: { type: "string" },
        },
        required: ["answerText"],
      },
      MockInterviewAnswerResponse: {
        type: "object",
        properties: {
          summary: { type: "string" },
          feedback: { type: "string" },
          record: { $ref: "#/components/schemas/MockInterviewRecord" },
        },
        required: ["summary", "feedback", "record"],
      },
      TranscriptionResponse: {
        type: "object",
        properties: {
          transcribedText: { type: "string" },
        },
        required: ["transcribedText"],
      },
      TTSRequest: {
        type: "object",
        properties: {
          text: { type: "string" },
        },
        required: ["text"],
      },
    },
  },
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "이메일과 비밀번호로 회원 가입",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignupRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "회원가입 성공",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupResponse" },
              },
            },
          },
          "400": {
            description: "유효성 오류 또는 중복 계정",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "이메일/비밀번호 로그인",
        description:
          "성공 시 응답 본문과 `token` HttpOnly 쿠키에 JWT가 포함됩니다.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SigninRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "로그인 성공",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description: "HttpOnly JWT 토큰 쿠키",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SigninResponse" },
              },
            },
          },
          "401": {
            description: "잘못된 자격 증명",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/signout": {
      post: {
        tags: ["Auth"],
        summary: "로그아웃",
        responses: {
          "200": {
            description: "로그아웃 성공",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/check-email": {
      get: {
        tags: ["Auth"],
        summary: "이메일 중복 확인",
        parameters: [
          {
            name: "email",
            in: "query",
            required: true,
            schema: { type: "string", format: "email" },
            description: "중복 여부를 확인할 이메일",
          },
        ],
        responses: {
          "200": {
            description: "중복 여부",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AvailabilityResponse" },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/check-nickname": {
      get: {
        tags: ["Auth"],
        summary: "닉네임 중복 확인",
        parameters: [
          {
            name: "nickname",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "중복 여부를 확인할 닉네임",
          },
        ],
        responses: {
          "200": {
            description: "중복 여부",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AvailabilityResponse" },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/user/me": {
      get: {
        tags: ["Users"],
        summary: "로그인한 사용자 정보 조회",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "사용자 정보",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserProfile" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "사용자 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "사용자 프로필 수정",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "수정 완료",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "업데이트 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/user/profile": {
      get: {
        tags: ["Users"],
        summary: "로그인한 사용자의 기본 프로필",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "프로필 정보",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProfileSummary" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/user/posts": {
      get: {
        tags: ["Users"],
        summary: "내가 작성한 게시글 조회",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "게시글 목록",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/BoardPost" },
                    },
                  },
                  required: ["posts"],
                },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "프로필 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/persona": {
      get: {
        tags: ["Persona"],
        summary: "저장된 면접 페르소나 조회",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "페르소나 정보 또는 null",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/Persona" },
                    { type: "null" },
                  ],
                },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Persona"],
        summary: "면접 페르소나 저장",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Persona" },
            },
          },
        },
        responses: {
          "200": {
            description: "저장된 페르소나",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Persona" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/comments": {
      get: {
        tags: ["Comments"],
        summary: "게시글의 댓글 조회",
        parameters: [
          {
            name: "postId",
            in: "query",
            required: true,
            schema: { type: "integer" },
            description: "대상 게시글 ID",
          },
        ],
        responses: {
          "200": {
            description: "댓글 목록",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Comment" },
                },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "댓글 작성",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "생성된 댓글",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/comments/{commentId}": {
      parameters: [
        {
          name: "commentId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        tags: ["Comments"],
        summary: "댓글 단건 조회",
        responses: {
          "200": {
            description: "댓글 정보",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/Comment" },
                    {
                      type: "object",
                      properties: {
                        post: { $ref: "#/components/schemas/BoardPost" },
                      },
                      required: ["post"],
                    },
                  ],
                },
              },
            },
          },
          "404": {
            description: "댓글 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Comments"],
        summary: "댓글 수정",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentUpdateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "수정된 댓글",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "댓글 삭제",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "삭제 결과",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentDeleteResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/boards/stats": {
      get: {
        tags: ["Boards"],
        summary: "게시판별 게시글 수",
        responses: {
          "200": {
            description: "게시판 통계",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BoardStatsResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/boards/{boardId}/posts": {
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        tags: ["Boards"],
        summary: "게시판 게시글 목록",
        responses: {
          "200": {
            description: "게시글 목록",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/BoardPostListItem",
                      },
                    },
                  },
                  required: ["posts"],
                },
              },
            },
          },
          "400": {
            description: "잘못된 게시판 ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Boards"],
        summary: "게시글 작성",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "생성된 게시글",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreatePostResponse" },
              },
            },
          },
          "400": {
            description: "유효하지 않은 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/boards/{boardId}/posts/{postId}": {
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        tags: ["Boards"],
        summary: "게시글 상세",
        responses: {
          "200": {
            description: "게시글 상세 정보",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BoardPostDetail" },
              },
            },
          },
          "404": {
            description: "게시글 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Boards"],
        summary: "게시글 수정",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePostRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "수정 결과",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdatePostResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Boards"],
        summary: "게시글 삭제",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "삭제 결과",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeletePostResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/boards/{boardId}/posts/{postId}/increment-view": {
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      post: {
        tags: ["Boards"],
        summary: "게시글 조회수 증가",
        responses: {
          "200": {
            description: "증가 결과",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": {
            description: "잘못된 게시글 ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/boards/{boardId}/search": {
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
        {
          name: "keyword",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "제목/본문 검색 키워드",
        },
      ],
      get: {
        tags: ["Boards"],
        summary: "게시글 검색",
        responses: {
          "200": {
            description: "검색 결과",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostsResponse" },
              },
            },
          },
        },
      },
    },
    "/api/attachments/{attachmentId}": {
      parameters: [
        {
          name: "attachmentId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      get: {
        tags: ["Attachments"],
        summary: "첨부파일 다운로드",
        responses: {
          "200": {
            description: "파일 스트림",
            content: {
              "application/octet-stream": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "파일 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/AIInterview": {
      get: {
        tags: ["AI Interview"],
        summary: "내 면접 세션 목록",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "세션 목록",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/MockInterviewSession" },
                },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/AIInterview/start": {
      post: {
        tags: ["AI Interview"],
        summary: "새 면접 세션 시작",
        security: [{ cookieAuth: [] }],
        responses: {
          "201": {
            description: "생성된 세션과 첫 질문",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sessionId: { type: "integer" },
                    question: { type: "string" },
                  },
                  required: ["sessionId", "question"],
                },
              },
            },
          },
          "400": {
            description: "페르소나 미설정 등",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/AIInterview/end": {
      post: {
        tags: ["AI Interview"],
        summary: "면접 세션 종료 및 요약 생성",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  sessionId: { type: "integer" },
                },
                required: ["sessionId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "세션 요약 및 피드백",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    summary: { type: "string" },
                    feedback: { type: "string" },
                  },
                  required: ["summary", "feedback"],
                },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/AIInterview/{sessionId}": {
      parameters: [
        {
          name: "sessionId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        tags: ["AI Interview"],
        summary: "세션 상세 기록 조회",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "세션 기록",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MockInterviewSessionDetail" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "서버 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["AI Interview"],
        summary: "답변 저장 후 다음 질문 요청",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  answerText: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "다음 질문 또는 저장 결과",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MockInterviewProgressResponse",
                },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["AI Interview"],
        summary: "세션 제목 수정",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "수정된 제목",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                  },
                  required: ["title"],
                },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["AI Interview"],
        summary: "세션 삭제",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "삭제 결과",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "인증 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "권한 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/AIInterview/{sessionId}/question": {
      parameters: [
        {
          name: "sessionId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      post: {
        tags: ["AI Interview"],
        summary: "새 질문 생성",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "생성된 질문",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MockInterviewQuestionResponse" },
              },
            },
          },
          "400": {
            description: "잘못된 세션 ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/AIInterview/{sessionId}/answer": {
      parameters: [
        {
          name: "sessionId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      post: {
        tags: ["AI Interview"],
        summary: "가장 최근 질문에 대한 답변 저장",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MockInterviewAnswerRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "요약 및 피드백",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MockInterviewAnswerResponse" },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "답변할 질문 없음",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/AIInterview/{sessionId}/record": {
      parameters: [
        {
          name: "sessionId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      post: {
        tags: ["AI Interview"],
        summary: "음성 답변 업로드 및 전사",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "브라우저에서 녹음한 음성 파일",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "전사된 텍스트",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TranscriptionResponse" },
              },
            },
          },
          "400": {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "전사 실패",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/tts": {
      post: {
        tags: ["TTS"],
        summary: "텍스트를 음성으로 변환",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TTSRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "생성된 음성",
            content: {
              "audio/mpeg": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
          "500": {
            description: "TTS 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
