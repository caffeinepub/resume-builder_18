import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();

  public type PersonalInfo = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
    summary : Text;
    photoUrl : ?Text;
    linkedin : ?Text;
    github : ?Text;
  };

  public type Experience = {
    jobTitle : Text;
    company : Text;
    startDate : Text;
    endDate : Text;
    description : Text;
  };

  public type Education = {
    degree : Text;
    institution : Text;
    graduationYear : Text;
    major : Text;
  };

  public type Skill = {
    name : Text;
    level : Text;
  };

  public type Project = {
    title : Text;
    description : Text;
    technologies : [Text];
    link : ?Text;
  };

  public type Certification = {
    name : Text;
    issuer : Text;
    issueDate : Text;
    expiryDate : Text;
  };

  public type Resume = {
    personalInfo : PersonalInfo;
    experiences : [Experience];
    education : [Education];
    skills : [Skill];
    projects : [Project];
    certifications : [Certification];
    createdAt : Int;
    updatedAt : Int;
  };

  let resumes = Map.empty<Text, Resume>();

  public shared ({ caller }) func saveResume(sessionToken : Text, resume : Resume) : async () {
    resumes.add(sessionToken, resume);
  };

  public query ({ caller }) func getResume(sessionToken : Text) : async Resume {
    switch (resumes.get(sessionToken)) {
      case (?resume) { resume };
      case (null) { Runtime.trap("Resume not found") };
    };
  };

  public shared ({ caller }) func deleteResume(sessionToken : Text) : async () {
    if (not resumes.containsKey(sessionToken)) {
      Runtime.trap("Resume not found");
    };
    resumes.remove(sessionToken);
  };
};
