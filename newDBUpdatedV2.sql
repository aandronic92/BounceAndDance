/****** Object:  Table [dbo].[AppUser]    Script Date: 07-04-2021 12:29:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[AppUser](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](30) NOT NULL,
	[LastName] [nvarchar](30) NULL,
	[DateOfBirth] [date] NOT NULL,
	[PhoneNumber] [int] NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Role] [nvarchar](15) NOT NULL,
	[membership] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[CLASS]    Script Date: 07-04-2021 12:30:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CLASS](
	[classId] [int] IDENTITY(1,1) NOT NULL,
	[userEmail] [nvarchar](255) NULL,
	[className] [nvarchar](20) NULL,
	[classDate] [date] NOT NULL,
	[classTime] [time](7) NOT NULL,
	[instructorId] [int] NULL,
	[approval] [nvarchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[classId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[MEMBERSHIP]    Script Date: 07-04-2021 12:31:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[MEMBERSHIP](
	[membershipId] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[membershipName] [varchar](20) NOT NULL,
	[membershipSessions] [int] NOT NULL,
	[membershipPrice] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[membershipId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[QUERIES]    Script Date: 07-04-2021 13:35:17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[QUERIES](
	[queryId] [int] IDENTITY(1,1) NOT NULL,
	[userEmail] [nvarchar](255) NOT NULL,
	[queryDesc] [nvarchar](200) NULL,
	[instructorId] [int] NULL,
	[instructorReply] [nvarchar](200) NULL,
	[userName] [nvarchar](40) NULL,
PRIMARY KEY CLUSTERED 
(
	[queryId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


GO
SET IDENTITY_INSERT [dbo].[AppUser] ON 
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName],[DateOfBirth],[PhoneNumber], [Email], [Role]) VALUES (1, N'Client', N'One','1981-03-03', 11223455, N'client@bounceanddance.com',  N'user')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName],[DateOfBirth],[PhoneNumber], [Email], [Role]) VALUES (2, N'Instructor', N'One','1990-01-01', 1234567891, N'instructor@bounceanddance.com', N'instructor')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [DateOfBirth],[PhoneNumber],[Email], [Role]) VALUES (3, N'Admin', N'One','1989-02-02', 22345566, N'admin@bounceanddance.com', N'admin')
GO
SET IDENTITY_INSERT [dbo].[AppUser] OFF
GO


SET IDENTITY_INSERT [dbo].[MEMBERSHIP] ON 
GO
INSERT [dbo].[MEMBERSHIP] ([membershipId],[membershipName], [membershipSessions], [membershipPrice]) VALUES (1, N'Silver', 5, 50)
GO
INSERT [dbo].[MEMBERSHIP] ([membershipId], [membershipName], [membershipSessions], [membershipPrice]) VALUES (2, N'Gold', 7, 65)
GO
INSERT [dbo].[MEMBERSHIP] ([membershipId],[membershipName], [membershipSessions], [membershipPrice]) VALUES (3, N'Platinium', 11, 100)
GO
SET IDENTITY_INSERT [dbo].[MEMBERSHIP] OFF
GO
