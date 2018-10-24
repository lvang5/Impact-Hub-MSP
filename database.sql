CREATE TABLE "person" (
	"id" serial NOT NULL,
	"username" varchar(80) NOT NULL,
	"password" varchar(80) NOT NULL,
	CONSTRAINT person_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "checkin" (
	"id" serial NOT NULL,
	"day" DATE DEFAULT CURRENT_DATE,
	"time" TIME DEFAULT CURRENT_TIMESTAMP,
	"name" varchar(250) NOT NULL,
	"quantity" integer  DEFAULT 1,
	"member" BOOLEAN  DEFAULT false,
	"visitor" BOOLEAN  DEFAULT false,
	"purpose" varchar(250) NOT NULL,
	"checked_in" BOOLEAN DEFAULT true,
	"cobot_id" varchar(500) ,
	CONSTRAINT checkin_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "members" (
	"id" serial NOT NULL,
	"name" varchar(250) NOT NULL,
	"company" varchar(250) NOT NULL,
	"img_url" varchar(1000),
	"cobot_id" varchar(500) NOT NULL,
	CONSTRAINT members_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "mailinglist" (
	"id" serial NOT NULL,
	"name" varchar(250) NOT NULL,
	"phone" int NOT NULL,
	"email" varchar(250) NOT NULL,
	"date_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"init_welcome" BOOLEAN DEFAULT false,
	CONSTRAINT mailinglist_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

  CREATE TABLE "messages" (
	"id" serial NOT NULL,
	"date_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"body" varchar(600),
	"cobot_id" varchar(500),
	"sender_name" varchar(255),
	CONSTRAINT twilio_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "twilioLogin" (
    admin_name character varying(50) PRIMARY KEY,
    phone_number bigint NOT NULL
);

CREATE UNIQUE INDEX "twilioLogin_pkey" ON "twilioLogin"(admin_name text_ops);












